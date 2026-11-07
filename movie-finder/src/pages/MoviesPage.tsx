import { useCallback, useMemo, useReducer, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createMovie,
  deleteMovie,
  getMovies,
  updateMovie,
  type Movie,
} from '../data/movies';
import MovieCard from '../components/MovieCard';
import MovieForm from '../components/MovieForm';
import { useDebounce } from '../hooks/useDebounce';
import { useFavorites } from '../context/FavoritesContext';
import type { MovieFormValues } from '../schemas/movieSchema';

type FilterStatus = 'all' | 'active' | 'completed' | 'favorites';

interface UiState {
  genreFilter: string;
  sortBy: 'rating' | 'year' | 'title';
  isFormOpen: boolean;
}

type UiAction =
  | { type: 'SET_GENRE'; payload: string }
  | { type: 'SET_SORT'; payload: 'rating' | 'year' | 'title' }
  | { type: 'TOGGLE_FORM' }
  | { type: 'OPEN_FORM' }
  | { type: 'CLOSE_FORM' };

function uiReducer(state: UiState, action: UiAction): UiState {
  switch (action.type) {
    case 'SET_GENRE':
      return { ...state, genreFilter: action.payload };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload };
    case 'TOGGLE_FORM':
      return { ...state, isFormOpen: !state.isFormOpen };
    case 'OPEN_FORM':
      return { ...state, isFormOpen: true };
    case 'CLOSE_FORM':
      return { ...state, isFormOpen: false };
    default:
      return state;
  }
}

export default function MoviesPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isFavorite, isWatched } = useFavorites();
  const rawFilter = searchParams.get('filter') as FilterStatus | null;
  const currentFilter: FilterStatus = rawFilter && ['active', 'completed', 'favorites'].includes(rawFilter) ? rawFilter : 'all';

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [uiState, dispatch] = useReducer(uiReducer, {
    genreFilter: 'ALL',
    sortBy: 'rating',
    isFormOpen: false,
  });

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ['movies', debouncedSearch],
    queryFn: () => getMovies(debouncedSearch),
  });

  const createMutation = useMutation({
    mutationFn: (values: MovieFormValues) => createMovie(values),
    onSuccess: () => {
      setEditingMovie(null);
      dispatch({ type: 'CLOSE_FORM' });
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (movie: Movie) => updateMovie(movie),
    onSuccess: () => {
      setEditingMovie(null);
      dispatch({ type: 'CLOSE_FORM' });
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteMovie(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['movies'] }),
  });

  function handleFilterChange(nextFilter: FilterStatus) {
    if (nextFilter === 'all') setSearchParams({});
    else setSearchParams({ filter: nextFilter });
  }

  const handleEditClick = useCallback((movie: Movie) => {
    setEditingMovie(movie);
    dispatch({ type: 'OPEN_FORM' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDeleteClick = useCallback((id: number) => {
    const movie = data.find((item) => item.id === id);
    if (movie && window.confirm(`Удалить «${movie.title}» из библиотеки?`)) {
      deleteMutation.mutate(id);
    }
  }, [data, deleteMutation]);

  async function handleFormSubmit(values: MovieFormValues) {
    if (editingMovie) {
      await updateMutation.mutateAsync({ ...editingMovie, ...values });
    } else {
      await createMutation.mutateAsync(values);
    }
  }

  const filteredMovies = useMemo(() => {
    return [...data]
      .filter((movie) => {
        if (currentFilter === 'active') return !isWatched(movie.id);
        if (currentFilter === 'completed') return isWatched(movie.id);
        if (currentFilter === 'favorites') return isFavorite(movie.id);
        return true;
      })
      .filter((movie) => uiState.genreFilter === 'ALL' || movie.genre === uiState.genreFilter)
      .sort((a, b) => {
        if (uiState.sortBy === 'rating') return b.rating - a.rating;
        if (uiState.sortBy === 'year') return b.year - a.year;
        return a.title.localeCompare(b.title, 'ru');
      });
  }, [data, currentFilter, uiState.genreFilter, uiState.sortBy, isWatched, isFavorite]);

  return (
    <div className="movies-page">
      <div className="page-heading-row">
        <div>
          <span className="eyebrow">ВАША КОЛЛЕКЦИЯ</span>
          <h1 className="page-title">Библиотека фильмов</h1>
          <p className="page-subtitle">Ищите фильмы в локальной коллекции, сохраняйте избранное и планируйте просмотры.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            if (uiState.isFormOpen) {
              setEditingMovie(null);
              dispatch({ type: 'CLOSE_FORM' });
            } else {
              setEditingMovie(null);
              dispatch({ type: 'OPEN_FORM' });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          {uiState.isFormOpen ? 'Закрыть форму' : 'Добавить фильм'}
        </button>
      </div>

      {uiState.isFormOpen && (
        <MovieForm
          onSubmit={handleFormSubmit}
          editingMovie={editingMovie}
          onCancelEdit={() => {
            setEditingMovie(null);
            dispatch({ type: 'CLOSE_FORM' });
          }}
        />
      )}

      <section className="library-controls" aria-label="Поиск и фильтры">
        <div className="search-wrap">
          <span className="search-symbol" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Название, режиссёр, жанр или год..."
            className="search-input"
            aria-label="Поиск по локальной библиотеке"
          />
          {search && <button type="button" className="clear-search" onClick={() => setSearch('')} aria-label="Очистить поиск">Очистить</button>}
        </div>

        <div className="select-controls">
          <label className="visually-hidden" htmlFor="genre-filter">Жанр</label>
          <select
            id="genre-filter"
            value={uiState.genreFilter}
            onChange={(event) => dispatch({ type: 'SET_GENRE', payload: event.target.value })}
            className="form-select"
          >
            <option value="ALL">Все жанры</option>
            <option value="Sci-Fi">Фантастика</option>
            <option value="Drama">Драма</option>
            <option value="Comedy">Комедия</option>
            <option value="Thriller">Триллер</option>
            <option value="Action">Боевик</option>
          </select>
          <label className="visually-hidden" htmlFor="sort-filter">Сортировка</label>
          <select
            id="sort-filter"
            value={uiState.sortBy}
            onChange={(event) => dispatch({ type: 'SET_SORT', payload: event.target.value as UiState['sortBy'] })}
            className="form-select"
          >
            <option value="rating">Сначала высокий рейтинг</option>
            <option value="year">Сначала новые</option>
            <option value="title">По названию</option>
          </select>
        </div>
      </section>

      <div className="library-subbar">
        <div className="filter-tabs" role="group" aria-label="Фильтр по статусу">
          <button type="button" className={`filter-tab ${currentFilter === 'all' ? 'active' : ''}`} onClick={() => handleFilterChange('all')}>Все фильмы</button>
          <button type="button" className={`filter-tab ${currentFilter === 'active' ? 'active' : ''}`} onClick={() => handleFilterChange('active')}>К просмотру</button>
          <button type="button" className={`filter-tab ${currentFilter === 'completed' ? 'active' : ''}`} onClick={() => handleFilterChange('completed')}>Просмотренные</button>
          <button type="button" className={`filter-tab ${currentFilter === 'favorites' ? 'active' : ''}`} onClick={() => handleFilterChange('favorites')}>Избранное</button>
        </div>
        <span className="results-count">{isLoading ? 'Загрузка...' : `${filteredMovies.length} фильмов`}</span>
      </div>

      {isLoading && <div className="loading-state"><span className="loading-indicator" />Загружаем локальную библиотеку</div>}

      {isError && (
        <div className="empty-state">
          <h2>Не удалось открыть библиотеку</h2>
          <p>{(error as Error).message}</p>
          <button type="button" className="btn btn-secondary" onClick={() => queryClient.invalidateQueries({ queryKey: ['movies'] })}>Обновить</button>
        </div>
      )}

      {!isLoading && !isError && filteredMovies.length === 0 && (
        <div className="empty-state">
          <span className="eyebrow">НИЧЕГО НЕ НАЙДЕНО</span>
          <h2>{search ? 'Попробуйте другой запрос' : 'В этом разделе пока пусто'}</h2>
          <p>{search ? 'Проверьте название, режиссёра или год выпуска. Поиск выполняется только по фильмам в вашей библиотеке.' : 'Измените фильтры или добавьте фильм в свою коллекцию.'}</p>
          {search && <button type="button" className="btn btn-secondary" onClick={() => setSearch('')}>Сбросить поиск</button>}
        </div>
      )}

      <ul className="movie-list">
        {filteredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onEdit={handleEditClick} onDelete={handleDeleteClick} />
        ))}
      </ul>
    </div>
  );
}
