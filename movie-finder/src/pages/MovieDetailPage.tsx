import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteMovie, getMovie, updateMovie } from '../data/movies';
import MovieForm from '../components/MovieForm';
import MoviePoster from '../components/MoviePoster';
import { useFavorites } from '../context/FavoritesContext';
import type { MovieFormValues } from '../schemas/movieSchema';

const genreLabels: Record<string, string> = {
  'Sci-Fi': 'Фантастика',
  Drama: 'Драма',
  Comedy: 'Комедия',
  Thriller: 'Триллер',
  Action: 'Боевик',
};

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isFavorite, isWatched, toggleFavorite, toggleWatched } = useFavorites();
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', id],
    queryFn: () => getMovie(id!),
    enabled: !!id,
    retry: false,
  });

  const updateMutation = useMutation({
    mutationFn: (values: MovieFormValues) => updateMovie({ ...data!, ...values }),
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (movieId: number) => deleteMovie(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      navigate('/movies');
    },
  });

  if (isLoading) return <div className="loading-state"><span className="loading-indicator" />Открываем карточку фильма</div>;

  if (isError || !data) {
    return (
      <div className="empty-state">
        <span className="eyebrow">ЛОКАЛЬНАЯ БИБЛИОТЕКА</span>
        <h2>Фильм не найден</h2>
        <p>Возможно, запись была удалена или адрес страницы некорректен.</p>
        <Link to="/movies" className="btn btn-primary">Вернуться в библиотеку</Link>
      </div>
    );
  }

  const favorite = isFavorite(data.id);
  const watched = isWatched(data.id);

  return (
    <div className="detail-page">
      <button type="button" className="back-link" onClick={() => navigate(-1)}>
        <span aria-hidden="true">←</span> Назад к библиотеке
      </button>

      {isEditing ? (
        <MovieForm
          editingMovie={data}
          onSubmit={async (values) => { await updateMutation.mutateAsync(values); }}
          onCancelEdit={() => setIsEditing(false)}
        />
      ) : (
        <article className="card detail-layout">
          <div className="detail-poster-wrap">
            <MoviePoster movie={data} className="detail-poster" />
            <div className="detail-rating"><strong>{data.rating.toFixed(1)}</strong><span>РЕЙТИНГ</span></div>
          </div>

          <div className="detail-content">
            <span className="eyebrow">КАРТОЧКА ФИЛЬМА</span>
            <div className="detail-title-row">
              <h1>{data.title}</h1>
              <span className="badge">{genreLabels[data.genre] ?? data.genre}</span>
            </div>

            <div className="detail-meta-grid">
              <div><span>Год выхода</span><strong>{data.year}</strong></div>
              <div><span>Режиссёр</span><strong>{data.director}</strong></div>
              <div><span>Статус</span><strong>{watched ? 'Просмотрено' : 'К просмотру'}</strong></div>
            </div>

            <div className="detail-description">
              <h2>О фильме</h2>
              <p>{data.body}</p>
            </div>

            <div className="detail-actions">
              <button type="button" className={`btn ${favorite ? 'btn-selected' : 'btn-secondary'}`} onClick={() => toggleFavorite(data.id)}>
                {favorite ? 'В избранном' : 'Добавить в избранное'}
              </button>
              <button type="button" className={`btn ${watched ? 'btn-selected' : 'btn-secondary'}`} onClick={() => toggleWatched(data.id)}>
                {watched ? 'Отметить как непросмотренный' : 'Отметить просмотренным'}
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>Редактировать</button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  if (window.confirm(`Удалить «${data.title}» из библиотеки?`)) deleteMutation.mutate(data.id);
                }}
              >
                Удалить
              </button>
            </div>
          </div>
        </article>
      )}
    </div>
  );
}
