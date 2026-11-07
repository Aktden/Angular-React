import { z } from 'zod';

// Схема формы создания и редактирования фильма.
// z.infer автоматически извлечёт из неё TypeScript-тип.
export const movieSchema = z.object({
  title: z
    .string()
    .min(2, 'Минимум 2 символа')
    .max(100, 'Максимум 100 символов'),

  body: z
    .string()
    .min(10, 'Описание должно быть не короче 10 символов')
    .max(600, 'Максимум 600 символов'),

  director: z
    .string()
    .min(2, 'Укажите режиссёра или студию (мин. 2 символа)')
    .max(80, 'Максимум 80 символов'),

  year: z.coerce
    .number({ invalid_type_error: 'Введите год числом' })
    .int('Только целое число')
    .min(1895, 'Кинематограф появился в 1895 году')
    .max(2030, 'Год не может быть больше 2030'),

  rating: z.coerce
    .number({ invalid_type_error: 'Введите число от 1 до 10' })
    .min(1, 'Минимальный рейтинг — 1')
    .max(10, 'Максимальный рейтинг — 10'),

  genre: z.enum(['Sci-Fi', 'Drama', 'Comedy', 'Thriller', 'Action']),

  poster: z
    .string()
    .url('Введите корректный URL постера (https://...)')
    .or(z.literal('')),
});

// Единый источник правды: схема -> тип
export type MovieFormValues = z.infer<typeof movieSchema>;

export const defaultMovieValues: MovieFormValues = {
  title: '',
  body: '',
  director: '',
  year: 2026,
  rating: 8.5,
  genre: 'Sci-Fi',
  poster: '',
};
