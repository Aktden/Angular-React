export type MovieGenre = 'Sci-Fi' | 'Drama' | 'Comedy' | 'Thriller' | 'Action';

export interface Movie {
  id: number;
  title: string;
  year: number;
  genre: MovieGenre;
  rating: number;
  director: string;
  body: string;
  poster: string;
  isCustom?: boolean;
}

const STORAGE_KEY = 'moviefinder_movies';
const LEGACY_CUSTOM_KEY = 'moviefinder_custom_movies';
const LEGACY_EDITED_KEY = 'moviefinder_edited_movies';
const LEGACY_DELETED_KEY = 'moviefinder_deleted_ids';

const SEED_MOVIES: Movie[] = [
  {
    id: 10001,
    title: 'Интерстеллар',
    year: 2014,
    genre: 'Sci-Fi',
    rating: 8.7,
    director: 'Кристофер Нолан',
    body: 'Когда Земля оказывается на грани экологической катастрофы, группа исследователей отправляется через червоточину на поиски нового дома для человечества. История о времени, выборе и силе человеческой привязанности.',
    poster: '',
  },
  {
    id: 10002,
    title: 'Начало',
    year: 2010,
    genre: 'Sci-Fi',
    rating: 8.8,
    director: 'Кристофер Нолан',
    body: 'Команда специалистов проникает в сны людей, чтобы извлекать секреты из подсознания. Последнее задание требует не украсть идею, а внедрить её, пройдя несколько уровней сна.',
    poster: '',
  },
  {
    id: 10003,
    title: 'Матрица',
    year: 1999,
    genre: 'Sci-Fi',
    rating: 8.7,
    director: 'Лана и Лилли Вачовски',
    body: 'Обычный программист узнаёт, что привычная реальность — искусственная симуляция. Присоединившись к сопротивлению, он пытается понять природу мира и собственное предназначение.',
    poster: '',
  },
  {
    id: 10004,
    title: 'Прибытие',
    year: 2016,
    genre: 'Sci-Fi',
    rating: 7.9,
    director: 'Дени Вильнёв',
    body: 'После появления загадочных кораблей на Земле лингвист пытается установить контакт с инопланетным разумом. Чтобы предотвратить глобальный конфликт, ей предстоит переосмыслить само понятие времени.',
    poster: '',
  },
  {
    id: 10005,
    title: 'Бегущий по лезвию 2049',
    year: 2017,
    genre: 'Sci-Fi',
    rating: 8.0,
    director: 'Дени Вильнёв',
    body: 'Офицер полиции обнаруживает секрет, способный изменить устройство общества. Поиски приводят его к бывшему охотнику за репликантами и заставляют усомниться в границах человечности.',
    poster: '',
  },
  {
    id: 10006,
    title: 'Дюна',
    year: 2021,
    genre: 'Sci-Fi',
    rating: 7.8,
    director: 'Дени Вильнёв',
    body: 'Наследник влиятельного дома прибывает на пустынную планету Арракис, где сосредоточен источник ценнейшего ресурса во Вселенной. Политические интриги и древние пророчества меняют его судьбу.',
    poster: '',
  },
  {
    id: 10007,
    title: 'Побег из Шоушенка',
    year: 1994,
    genre: 'Drama',
    rating: 9.3,
    director: 'Фрэнк Дарабонт',
    body: 'Банкир, несправедливо осуждённый за убийство, оказывается в тюрьме Шоушенк. Годы заключения не лишают его надежды, а дружба с другим заключённым помогает сохранить достоинство.',
    poster: '',
  },
  {
    id: 10008,
    title: 'Зелёная миля',
    year: 1999,
    genre: 'Drama',
    rating: 9.1,
    director: 'Фрэнк Дарабонт',
    body: 'Надзиратель блока смертников встречает необычного заключённого, обладающего необъяснимым даром. Это знакомство заставляет его пересмотреть представления о справедливости, сострадании и чудесах.',
    poster: '',
  },
  {
    id: 10009,
    title: 'Одержимость',
    year: 2014,
    genre: 'Drama',
    rating: 8.5,
    director: 'Дэмьен Шазелл',
    body: 'Молодой барабанщик поступает в престижную музыкальную консерваторию и попадает под руководство безжалостного преподавателя. Стремление к совершенству постепенно превращается в разрушительное испытание.',
    poster: '',
  },
  {
    id: 10010,
    title: 'Паразиты',
    year: 2019,
    genre: 'Thriller',
    rating: 8.5,
    director: 'Пон Джун-хо',
    body: 'Бедная семья постепенно устраивается на работу в дом состоятельных людей. За внешне комичной историей социального контраста скрывается напряжённая драма с неожиданными поворотами.',
    poster: '',
  },
  {
    id: 10011,
    title: 'Семь',
    year: 1995,
    genre: 'Thriller',
    rating: 8.6,
    director: 'Дэвид Финчер',
    body: 'Два детектива расследуют серию жестоких преступлений, каждое из которых связано с одним из семи смертных грехов. Следствие превращается в мрачную психологическую игру с опасным противником.',
    poster: '',
  },
  {
    id: 10012,
    title: 'Достать ножи',
    year: 2019,
    genre: 'Thriller',
    rating: 7.9,
    director: 'Райан Джонсон',
    body: 'После смерти известного писателя детектив берётся за расследование внутри большой и крайне непростой семьи. У каждого родственника есть мотив, тайна и собственная версия событий.',
    poster: '',
  },
  {
    id: 10013,
    title: 'Отель «Гранд Будапешт»',
    year: 2014,
    genre: 'Comedy',
    rating: 8.1,
    director: 'Уэс Андерсон',
    body: 'Легендарный консьерж и его молодой помощник оказываются втянуты в историю с наследством, пропавшей картиной и чередой невероятных приключений на фоне меняющейся Европы.',
    poster: '',
  },
  {
    id: 10014,
    title: '1+1',
    year: 2011,
    genre: 'Comedy',
    rating: 8.8,
    director: 'Оливье Накаш и Эрик Толедано',
    body: 'После несчастного случая богатый аристократ нанимает помощника из совершенно другого мира. Неожиданная дружба помогает обоим взглянуть на жизнь иначе и выйти за пределы привычных правил.',
    poster: '',
  },
  {
    id: 10015,
    title: 'Назад в будущее',
    year: 1985,
    genre: 'Comedy',
    rating: 8.5,
    director: 'Роберт Земекис',
    body: 'Подросток случайно отправляется на тридцать лет назад на машине времени, созданной эксцентричным учёным. Чтобы вернуться домой, ему нужно восстановить ход событий и не нарушить собственное будущее.',
    poster: '',
  },
  {
    id: 10016,
    title: 'Тёмный рыцарь',
    year: 2008,
    genre: 'Action',
    rating: 9.0,
    director: 'Кристофер Нолан',
    body: 'Бэтмен, комиссар Гордон и прокурор Харви Дент пытаются очистить Готэм от преступности. Появление непредсказуемого Джокера превращает борьбу за город в проверку моральных принципов.',
    poster: '',
  },
  {
    id: 10017,
    title: 'Безумный Макс: Дорога ярости',
    year: 2015,
    genre: 'Action',
    rating: 8.1,
    director: 'Джордж Миллер',
    body: 'В постапокалиптической пустыне Макс присоединяется к Фуриосе, которая пытается спасти группу женщин от жестокого правителя. Их путь превращается в непрерывную погоню за свободой.',
    poster: '',
  },
  {
    id: 10018,
    title: 'Грань будущего',
    year: 2014,
    genre: 'Action',
    rating: 7.9,
    director: 'Даг Лайман',
    body: 'Во время войны с инопланетной расой офицер попадает во временную петлю и вынужден снова и снова переживать один и тот же бой. Каждая попытка приближает его к разгадке и победе.',
    poster: '',
  },
];

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeMovies(movies: Movie[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
}

function readMovies(): Movie[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored !== null) {
    try {
      const parsed = JSON.parse(stored) as Movie[];
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Повреждённое хранилище будет восстановлено из стартовой коллекции.
    }
  }

  const customMovies = readJson<Movie[]>(LEGACY_CUSTOM_KEY, []);
  const editedMovies = readJson<Record<number, Movie>>(LEGACY_EDITED_KEY, {});
  const deletedIds = readJson<number[]>(LEGACY_DELETED_KEY, []);

  const migrated = [
    ...SEED_MOVIES.map((movie) => editedMovies[movie.id] ?? movie),
    ...customMovies,
  ].filter((movie) => !deletedIds.includes(movie.id));

  writeMovies(migrated);
  localStorage.removeItem(LEGACY_CUSTOM_KEY);
  localStorage.removeItem(LEGACY_EDITED_KEY);
  localStorage.removeItem(LEGACY_DELETED_KEY);
  return migrated;
}

export async function getMovies(searchQuery = ''): Promise<Movie[]> {
  const query = searchQuery.trim().toLocaleLowerCase('ru');
  const movies = readMovies();

  if (!query) return movies;

  return movies.filter((movie) =>
    [movie.title, movie.director, movie.genre, String(movie.year), movie.body]
      .join(' ')
      .toLocaleLowerCase('ru')
      .includes(query)
  );
}

export async function getMovie(id: string): Promise<Movie> {
  const movie = readMovies().find((item) => item.id === Number(id));
  if (!movie) throw new Error('Фильм не найден в локальной библиотеке');
  return movie;
}

export async function createMovie(data: Omit<Movie, 'id'>): Promise<Movie> {
  const movies = readMovies();
  const id = Math.max(Date.now(), ...movies.map((movie) => movie.id + 1));
  const newMovie: Movie = { ...data, id, poster: data.poster?.trim() ?? '', isCustom: true };
  writeMovies([newMovie, ...movies]);
  return newMovie;
}

export async function updateMovie({ id, ...data }: Movie): Promise<Movie> {
  const movies = readMovies();
  const existing = movies.find((movie) => movie.id === id);
  if (!existing) throw new Error('Не удалось найти фильм для изменения');

  const updated: Movie = {
    ...existing,
    ...data,
    id,
    poster: data.poster?.trim() ?? '',
  };
  writeMovies(movies.map((movie) => (movie.id === id ? updated : movie)));
  return updated;
}

export async function deleteMovie(id: number): Promise<void> {
  writeMovies(readMovies().filter((movie) => movie.id !== id));
}

export function resetMovieLibrary(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_CUSTOM_KEY);
  localStorage.removeItem(LEGACY_EDITED_KEY);
  localStorage.removeItem(LEGACY_DELETED_KEY);
}
