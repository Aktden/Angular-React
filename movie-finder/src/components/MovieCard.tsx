import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import type { Movie } from '../data/movies';
import MoviePoster from './MoviePoster';

interface MovieCardProps {
  movie: Movie;
  onEdit: (movie: Movie) => void;
  onDelete: (id: number) => void;
}

const genreLabels: Record<string, string> = {
  'Sci-Fi': 'Фантастика',
  Drama: 'Драма',
  Comedy: 'Комедия',
  Thriller: 'Триллер',
  Action: 'Боевик',
};

const MovieCard = memo(function MovieCard({ movie, onEdit, onDelete }: MovieCardProps) {
  const { isFavorite, isWatched, toggleFavorite, toggleWatched } = useFavorites();
  const favorite = isFavorite(movie.id);
  const watched = isWatched(movie.id);

  return (
    <li className={`movie-card ${watched ? 'watched-card' : ''}`}>
      <Link to={`/movies/${movie.id}`} className="movie-poster-link" aria-label={`Открыть фильм ${movie.title}`}>
        <MoviePoster movie={movie} />
        <span className="poster-rating">{movie.rating.toFixed(1)}</span>
        {watched && <span className="poster-watched">Просмотрено</span>}
      </Link>

      <div className="movie-info">
        <div className="movie-title-row">
          <Link to={`/movies/${movie.id}`} className="movie-title-link">
            {movie.title}
          </Link>
          {movie.isCustom && <span className="badge badge-custom">Мой фильм</span>}
        </div>

        <div className="movie-meta">
          <span>{movie.year}</span>
          <span>{genreLabels[movie.genre] ?? movie.genre}</span>
          <span>{movie.director}</span>
        </div>

        <p className="movie-summary-preview">{movie.body}</p>

        <div className="movie-actions">
          <button
            type="button"
            onClick={() => toggleFavorite(movie.id)}
            className={`text-action ${favorite ? 'selected' : ''}`}
            aria-pressed={favorite}
          >
            {favorite ? 'В избранном' : 'В избранное'}
          </button>
          <button
            type="button"
            onClick={() => toggleWatched(movie.id)}
            className={`text-action ${watched ? 'selected' : ''}`}
            aria-pressed={watched}
          >
            {watched ? 'Просмотрено' : 'Отметить просмотр'}
          </button>
          <div className="movie-card-tools">
            <button type="button" className="icon-button" onClick={() => onEdit(movie)} aria-label={`Редактировать ${movie.title}`} title="Редактировать">
              Изменить
            </button>
            <button type="button" className="icon-button danger-text" onClick={() => onDelete(movie.id)} aria-label={`Удалить ${movie.title}`} title="Удалить">
              Удалить
            </button>
          </div>
        </div>
      </div>
    </li>
  );
});

export default MovieCard;
