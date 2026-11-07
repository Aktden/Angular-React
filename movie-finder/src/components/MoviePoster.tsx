import { useState, type CSSProperties } from 'react';
import type { Movie } from '../data/movies';

interface MoviePosterProps {
  movie: Movie;
  className?: string;
}

export default function MoviePoster({ movie, className = '' }: MoviePosterProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const posterClass = `movie-poster ${className}`.trim();

  if (movie.poster && !imageFailed) {
    return (
      <img
        src={movie.poster}
        alt={`Постер фильма «${movie.title}»`}
        className={posterClass}
        loading="lazy"
        onError={() => setImageFailed(true)}
      />
    );
  }

  const style = { '--poster-hue': (movie.id * 37) % 360 } as CSSProperties & { '--poster-hue': number };

  return (
    <div className={`${posterClass} poster-placeholder`} style={style} role="img" aria-label={movie.title}>
      <span className="poster-overline">КОЛЛЕКЦИЯ ФИЛЬМОВ</span>
      <strong>{movie.title}</strong>
      <span className="poster-caption">{movie.year} · {movie.genre}</span>
    </div>
  );
}
