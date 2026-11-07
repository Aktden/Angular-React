import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  movieSchema,
  defaultMovieValues,
  type MovieFormValues,
} from '../schemas/movieSchema';
import type { Movie } from '../data/movies';

interface MovieFormProps {
  onSubmit: (data: MovieFormValues) => Promise<void>;
  editingMovie?: Movie | null;
  onCancelEdit?: () => void;
}

export default function MovieForm({ onSubmit, editingMovie, onCancelEdit }: MovieFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<MovieFormValues>({
    resolver: zodResolver(movieSchema),
    mode: 'onChange',
    defaultValues: defaultMovieValues,
  });

  useEffect(() => {
    if (editingMovie) {
      reset({
        title: editingMovie.title,
        body: editingMovie.body,
        director: editingMovie.director,
        year: editingMovie.year,
        rating: editingMovie.rating,
        genre: editingMovie.genre,
        poster: editingMovie.poster,
      });
    } else {
      reset(defaultMovieValues);
    }
  }, [editingMovie, reset]);

  async function handleFormSubmit(data: MovieFormValues) {
    await onSubmit(data);
    reset(defaultMovieValues);
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="card movie-form">
      <div className="form-heading">
        <div>
          <span className="eyebrow">КОЛЛЕКЦИЯ</span>
          <h2>{editingMovie ? 'Редактирование фильма' : 'Новый фильм'}</h2>
          <p>{editingMovie ? `Измените информацию о фильме «${editingMovie.title}».` : 'Добавьте фильм в личную библиотеку.'}</p>
        </div>
        {editingMovie && onCancelEdit && (
          <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>Отмена</button>
        )}
      </div>

      <div className="form-row form-row-main">
        <div className="form-field">
          <label className="form-label" htmlFor="movie-title">Название фильма</label>
          <input id="movie-title" {...register('title')} placeholder="Например, Интерстеллар" className="form-input" />
          {errors.title && <p className="form-error">{errors.title.message}</p>}
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="movie-director">Режиссёр</label>
          <input id="movie-director" {...register('director')} placeholder="Имя режиссёра" className="form-input" />
          {errors.director && <p className="form-error">{errors.director.message}</p>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="form-label" htmlFor="movie-year">Год выхода</label>
          <input id="movie-year" type="number" {...register('year')} className="form-input" />
          {errors.year && <p className="form-error">{errors.year.message}</p>}
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="movie-rating">Рейтинг от 1 до 10</label>
          <input id="movie-rating" type="number" step="0.1" {...register('rating')} className="form-input" />
          {errors.rating && <p className="form-error">{errors.rating.message}</p>}
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="movie-genre">Жанр</label>
          <select id="movie-genre" {...register('genre')} className="form-select">
            <option value="Sci-Fi">Фантастика</option>
            <option value="Drama">Драма</option>
            <option value="Comedy">Комедия</option>
            <option value="Thriller">Триллер</option>
            <option value="Action">Боевик</option>
          </select>
        </div>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="movie-poster">Ссылка на постер</label>
        <input id="movie-poster" {...register('poster')} placeholder="https://example.com/poster.jpg" className="form-input" />
        <span className="form-hint">Необязательно. Если оставить поле пустым, будет создана стилизованная обложка.</span>
        {errors.poster && <p className="form-error">{errors.poster.message}</p>}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="movie-body">Описание</label>
        <textarea id="movie-body" {...register('body')} placeholder="Кратко расскажите о сюжете фильма..." rows={4} className="form-textarea" />
        {errors.body && <p className="form-error">{errors.body.message}</p>}
      </div>

      <div className="form-submit-row">
        <span className="form-hint">Изменения сохраняются локально в браузере.</span>
        <button type="submit" disabled={!isValid || isSubmitting} className="btn btn-primary">
          {isSubmitting ? 'Сохранение...' : editingMovie ? 'Сохранить изменения' : 'Добавить в библиотеку'}
        </button>
      </div>
    </form>
  );
}
