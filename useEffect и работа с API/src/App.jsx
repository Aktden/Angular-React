import { useEffect, useRef, useState } from 'react';

const tasks = [
  'Факты о кошках',
  'Погода',
  'Страницы публикаций',
  'Поиск с задержкой',
  'Форма отзыва',
  'Страна и город',
  'Фокус на ошибке',
  'Файловый input',
  'Таймер бездействия',
  'Многошаговая форма',
];

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Ошибка HTTP ${response.status}`);
  return response.json();
}

function Status({ loading, error, children }) {
  if (loading) return <p className="status">Загрузка…</p>;
  if (error) return <p className="error" role="alert">{error}</p>;
  return children ?? null;
}

function CatFacts() {
  const [fact, setFact] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadFact(signal) {
    setLoading(true);
    setError('');
    try {
      const data = await fetchJson('https://catfact.ninja/fact', { signal });
      // API возвращает факты на английском; переводим их на русский для интерфейса.
      try {
        const translated = await fetchJson(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(data.fact)}&langpair=en|ru`,
          { signal }
        );
        setFact(translated.responseData?.translatedText || data.fact);
      } catch (translationError) {
        if (translationError.name === 'AbortError') throw translationError;
        setFact('Не удалось перевести факт. Нажмите «Ещё один факт», чтобы попробовать снова.');
      }
    } catch (err) {
      if (err.name !== 'AbortError') setError('Не удалось загрузить факт. Проверьте интернет и попробуйте ещё раз.');
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadFact(controller.signal);
    return () => controller.abort();
  }, []);

  function refresh() {
    loadFact();
  }

  return <section className="panel">
    <p className="eyebrow">Упражнение 1 · useEffect + fetch</p>
    <h2>Факты о кошках</h2>
    <Status loading={loading} error={error}>
      <blockquote className="fact">{fact || 'Нажмите кнопку, чтобы получить факт.'}</blockquote>
    </Status>
    <button onClick={refresh} disabled={loading}>{loading ? 'Загружаем…' : 'Ещё один факт'}</button>
  </section>;
}

function Weather() {
  const [city, setCity] = useState('Moscow');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchedCity, setSearchedCity] = useState('');

  async function searchWeather(event) {
    event.preventDefault();
    const query = city.trim();
    if (!query) { setError('Введите название города.'); return; }
    setLoading(true); setError(''); setWeather(null);
    try {
      const geo = await fetchJson(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=ru&format=json`);
      const place = geo.results?.[0];
      if (!place) throw new Error('Город не найден. Попробуйте другое название.');
      const params = new URLSearchParams({
        latitude: place.latitude,
        longitude: place.longitude,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m',
        timezone: 'auto'
      });
      const data = await fetchJson(`https://api.open-meteo.com/v1/forecast?${params}`);
      setWeather({ ...data.current, place });
      setSearchedCity(`${place.name}${place.country ? `, ${place.country}` : ''}`);
    } catch (err) {
      setError(err.message || 'Не удалось загрузить погоду.');
    } finally { setLoading(false); }
  }

  return <section className="panel">
    <p className="eyebrow">Упражнение 2 · два запроса к сервисам</p>
    <h2>Погода в городе</h2>
    <form className="inline-form" onSubmit={searchWeather}>
      <label className="sr-only" htmlFor="weather-city">Город</label>
      <input id="weather-city" value={city} onChange={e => setCity(e.target.value)} placeholder="Например, Казань" />
      <button disabled={loading}>{loading ? 'Ищем…' : 'Узнать погоду'}</button>
    </form>
    {loading && <p className="status">Ищем город и загружаем прогноз…</p>}
    {error && <p className="error" role="alert">{error}</p>}
    {weather && !loading && <div className="weather-card">
      <h3>{searchedCity}</h3>
      <div className="temperature">{Math.round(weather.temperature_2m)}°C</div>
      <p>Ощущается как: {Math.round(weather.apparent_temperature)}°C</p>
      <div className="metric-grid">
        <div><span>Влажность</span><strong>{weather.relative_humidity_2m}%</strong></div>
        <div><span>Ветер</span><strong>{weather.wind_speed_10m} км/ч</strong></div>
      </div>
      <small>Данные на {weather.time?.replace('T', ' ')}</small>
    </div>}
  </section>;
}

function PostsPagination() {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError('');
    fetchJson(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`, { signal: controller.signal })
      .then(setPosts)
      .catch(err => { if (err.name !== 'AbortError') setError('Не удалось загрузить публикации.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [page]);

  return <section className="panel">
    <p className="eyebrow">Упражнение 3 · зависимости эффекта</p>
    <h2>Публикации</h2>
    <p className="muted">Страница {page} · по 10 записей</p>
    <Status loading={loading} error={error}>
      <div className="post-list">{posts.map(post => <article className="post" key={post.id}>
        <span className="post-id">#{post.id}</span>
        <div><h3>{post.title}</h3><p>{post.body}</p></div>
      </article>)}</div>
    </Status>
    <div className="pagination">
      <button className="secondary" disabled={page === 1 || loading} onClick={() => setPage(p => p - 1)}>← Назад</button>
      <span>Страница {page} из 10</span>
      <button disabled={page === 10 || loading} onClick={() => setPage(p => p + 1)}>Вперёд →</button>
    </div>
  </section>;
}

function DebouncedSearch() {
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState('');

  useEffect(() => {
    if (!query.trim()) { setPosts([]); setSearched(''); setError(''); setLoading(false); return; }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true); setError('');
      try {
        const data = await fetchJson(`https://jsonplaceholder.typicode.com/posts?q=${encodeURIComponent(query.trim())}`, { signal: controller.signal });
        setPosts(data.slice(0, 8)); setSearched(query.trim());
      } catch (err) {
        if (err.name !== 'AbortError') setError('Поиск не выполнен. Попробуйте ещё раз.');
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }, 500);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);

  return <section className="panel">
    <p className="eyebrow">Упражнение 4 · задержка + очистка таймера</p>
    <h2>Поиск публикаций</h2>
    <label htmlFor="search-posts">Введите слово или часть заголовка</label>
    <input id="search-posts" className="wide-input" value={query} onChange={e => setQuery(e.target.value)} placeholder="Например, sunt" />
    <p className="muted">Запрос отправляется через 500 мс после окончания ввода.</p>
    {loading && <p className="status">Ищем…</p>}
    {error && <p className="error" role="alert">{error}</p>}
    {!loading && searched && <p className="muted">Результаты для «{searched}»: {posts.length}</p>}
    {!loading && searched && posts.length === 0 && <p>Ничего не найдено.</p>}
    <div className="post-list">{posts.map(post => <article className="post" key={post.id}>
      <span className="post-id">#{post.id}</span><div><h3>{post.title}</h3><p>{post.body}</p></div>
    </article>)}</div>
  </section>;
}

function ReviewForm() {
  const empty = { name: '', rating: '5', text: '' };
  const [form, setForm] = useState(empty);
  const [submitted, setSubmitted] = useState(null);
  const errors = {
    name: form.name.trim().length < 2 ? 'Введите имя (минимум 2 символа).' : '',
    text: form.text.trim().length < 10 ? 'Отзыв должен содержать минимум 10 символов.' : ''
  };
  const valid = !errors.name && !errors.text;
  function change(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); }
  function submit(e) {
    e.preventDefault();
    if (!valid) return;
    setSubmitted({ ...form, name: form.name.trim(), text: form.text.trim() });
    setForm(empty);
  }
  return <section className="panel">
    <p className="eyebrow">Упражнение 5 · управляемая форма</p>
    <h2>Оставить отзыв</h2>
    <form className="stack-form" onSubmit={submit} noValidate>
      <label>Имя<input name="name" value={form.name} onChange={change} onBlur={e => e.target.dataset.touched = 'true'} /></label>
      {errors.name && <small className="error">{errors.name}</small>}
      <label>Оценка
        <select name="rating" value={form.rating} onChange={change}>
          {[5,4,3,2,1].map(n => <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>)}
        </select>
      </label>
      <label>Текст отзыва<textarea name="text" rows="4" value={form.text} onChange={change} placeholder="Расскажите о впечатлениях…" /></label>
      {errors.text && <small className="error">{errors.text}</small>}
      <button disabled={!valid}>Отправить отзыв</button>
    </form>
    {submitted && <div className="success"><h3>Спасибо за отзыв, {submitted.name}!</h3><p className="stars">{'★'.repeat(Number(submitted.rating))}{'☆'.repeat(5 - Number(submitted.rating))}</p><p>{submitted.text}</p><button className="secondary" onClick={() => setSubmitted(null)}>Скрыть отзыв</button></div>}
  </section>;
}

const countryCities = {
  Россия: ['Москва', 'Казань', 'Санкт-Петербург', 'Новосибирск'],
  Казахстан: ['Алматы', 'Астана', 'Шымкент'],
  Беларусь: ['Минск', 'Брест', 'Гродно'],
  Германия: ['Берлин', 'Гамбург', 'Мюнхен']
};

function CountryCityForm() {
  const [country, setCountry] = useState('Россия');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');
  function changeCountry(e) { setCountry(e.target.value); setCity(''); setMessage(''); }
  function submit(e) { e.preventDefault(); setMessage(city ? `Выбрано: ${city}, ${country}.` : 'Выберите город.'); }
  return <section className="panel">
    <p className="eyebrow">Упражнение 6 · зависимая валидация</p>
    <h2>Страна и город</h2>
    <form className="stack-form" onSubmit={submit}>
      <label>Страна<select value={country} onChange={changeCountry}>{Object.keys(countryCities).map(c => <option key={c}>{c}</option>)}</select></label>
      <label>Город<select value={city} onChange={e => { setCity(e.target.value); setMessage(''); }}>
        <option value="">Выберите город</option>
        {countryCities[country].map(c => <option key={c}>{c}</option>)}
      </select></label>
      <p className="muted">Список городов автоматически меняется при выборе страны.</p>
      <button>Подтвердить выбор</button>
    </form>
    {message && <p className={city ? 'success-text' : 'error'} role="status">{message}</p>}
  </section>;
}

function FocusForm() {
  const [values, setValues] = useState({ name: '', email: '' });
  const [attempted, setAttempted] = useState(false);
  const refs = { name: useRef(null), email: useRef(null) };
  const errors = {
    name: values.name.trim().length < 2 ? 'Имя должно содержать минимум 2 символа.' : '',
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ? 'Введите корректный email.' : ''
  };
  function submit(e) {
    e.preventDefault(); setAttempted(true);
    const first = Object.keys(errors).find(key => errors[key]);
    if (first) { refs[first].current?.focus(); return; }
    alert(`Форма заполнена: ${values.name} (${values.email})`);
    setValues({ name: '', email: '' }); setAttempted(false); refs.name.current?.focus();
  }
  return <section className="panel">
    <p className="eyebrow">Упражнение 7 · useRef + валидация</p>
    <h2>Фокус на первом поле с ошибкой</h2>
    <form className="stack-form" onSubmit={submit} noValidate>
      <label>Имя<input ref={refs.name} value={values.name} onChange={e => setValues(v => ({ ...v, name: e.target.value }))} /></label>
      {attempted && errors.name && <small className="error">{errors.name}</small>}
      <label>Email<input ref={refs.email} type="email" value={values.email} onChange={e => setValues(v => ({ ...v, email: e.target.value }))} /></label>
      {attempted && errors.email && <small className="error">{errors.email}</small>}
      <button>Проверить форму</button>
    </form>
    <p className="muted">При отправке фокус перемещается на первое поле с ошибкой.</p>
  </section>;
}

function FileInput() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  function reset() { setFile(null); if (inputRef.current) inputRef.current.value = ''; }
  return <section className="panel">
    <p className="eyebrow">Упражнение 8 · Доступ к элементу через useRef</p>
    <h2>Выбор файла</h2>
    <input ref={inputRef} className="file-input" type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
    <button className="secondary" onClick={() => inputRef.current?.click()}>Выбрать файл</button>
    {file ? <div className="file-card"><strong>{file.name}</strong><span>{(file.size / 1024).toFixed(1)} КБ</span><button className="secondary" onClick={reset}>Сбросить</button></div> : <p className="muted">Файл пока не выбран.</p>}
  </section>;
}

function InactivityTimer() {
  const [active, setActive] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  function clearTimers() {
    clearTimeout(timerRef.current);
    clearInterval(countdownRef.current);
  }
  function resetTimer() {
    clearTimers();
    lastActivityRef.current = Date.now();
    setActive(false); setSeconds(30);
    timerRef.current = setTimeout(() => setActive(true), 30000);
    countdownRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.ceil(30 - (Date.now() - lastActivityRef.current) / 1000));
      setSeconds(remaining);
    }, 250);
  }
  useEffect(() => {
    resetTimer();
    return clearTimers;
  }, []);
  return <section className="panel" onMouseMove={resetTimer} onKeyDown={resetTimer} onClick={resetTimer} onTouchStart={resetTimer}>
    <p className="eyebrow">Упражнение 9 · useEffect + useRef + таймер</p>
    <h2>Контроль бездействия</h2>
    <p>Двигайте мышью, нажимайте клавиши или взаимодействуйте с этой карточкой, чтобы перезапустить таймер.</p>
    <div className="timer-face">{active ? 'Подсказка!' : `${seconds} сек.`}</div>
    {active && <div className="notice" role="status">Всё ещё с нами? Продолжайте заполнение, если хотите.</div>}
    <button className="secondary" onClick={e => { e.stopPropagation(); resetTimer(); }}>Перезапустить таймер</button>
  </section>;
}

function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', country: '', city: '', notes: '' });
  const [attempted, setAttempted] = useState(false);
  const refs = { name: useRef(null), email: useRef(null), country: useRef(null), city: useRef(null) };
  const errors = {
    name: form.name.trim().length < 2 ? 'Введите имя (минимум 2 символа).' : '',
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'Введите корректный email.' : '',
    country: !form.country.trim() ? 'Введите страну.' : '',
    city: !form.city.trim() ? 'Введите город.' : ''
  };
  function update(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); }
  function next() {
    setAttempted(true);
    const fields = step === 1 ? ['name', 'email'] : ['country', 'city'];
    const first = fields.find(key => errors[key]);
    if (first) { refs[first].current?.focus(); return; }
    setAttempted(false); setStep(s => s + 1);
  }
  function back() { setAttempted(false); setStep(s => s - 1); }
  if (done) return <section className="panel">
    <p className="eyebrow">Упражнение 10 · финал</p><h2>Данные подтверждены</h2>
    <div className="success"><p><strong>Имя:</strong> {form.name}</p><p><strong>Email:</strong> {form.email}</p><p><strong>Страна:</strong> {form.country}</p><p><strong>Город:</strong> {form.city}</p><p><strong>Комментарий:</strong> {form.notes || '—'}</p></div>
    <button onClick={() => { setForm({ name: '', email: '', country: '', city: '', notes: '' }); setStep(1); setDone(false); }}>Заполнить заново</button>
  </section>;
  return <section className="panel">
    <p className="eyebrow">Упражнение 10 · общее состояние формы</p>
    <h2>Многошаговая форма</h2>
    <div className="steps"><span className={step >= 1 ? 'current' : ''}>1. Личные данные</span><span className={step >= 2 ? 'current' : ''}>2. Адрес</span><span className={step >= 3 ? 'current' : ''}>3. Проверка</span></div>
    {step === 1 && <div className="stack-form">
      <label>Имя<input ref={refs.name} name="name" value={form.name} onChange={update} /></label>
      {attempted && errors.name && <small className="error">{errors.name}</small>}
      <label>Email<input ref={refs.email} name="email" type="email" value={form.email} onChange={update} /></label>
      {attempted && errors.email && <small className="error">{errors.email}</small>}
    </div>}
    {step === 2 && <div className="stack-form">
      <label>Страна<input ref={refs.country} name="country" value={form.country} onChange={update} /></label>
      {attempted && errors.country && <small className="error">{errors.country}</small>}
      <label>Город<input ref={refs.city} name="city" value={form.city} onChange={update} /></label>
      {attempted && errors.city && <small className="error">{errors.city}</small>}
    </div>}
    {step === 3 && <div className="review-summary">
      <p><strong>Имя:</strong> {form.name}</p><p><strong>Email:</strong> {form.email}</p><p><strong>Страна:</strong> {form.country}</p><p><strong>Город:</strong> {form.city}</p>
      <label>Комментарий (необязательно)<textarea name="notes" rows="3" value={form.notes} onChange={update} /></label>
    </div>}
    <div className="form-actions">
      {step > 1 && <button className="secondary" onClick={back}>← Назад</button>}
      {step < 3 ? <button onClick={next}>Далее →</button> : <button onClick={() => setDone(true)}>Подтвердить</button>}
    </div>
  </section>;
}

const components = [CatFacts, Weather, PostsPagination, DebouncedSearch, ReviewForm, CountryCityForm, FocusForm, FileInput, InactivityTimer, MultiStepForm];

export default function App() {
  const [active, setActive] = useState(0);
  const CurrentTask = components[active];
  return <div className="app-shell">
    <header className="hero">
      <div className="hero-inner">
        <span className="kicker">REACT · ПРАКТИКА</span>
        <h1>useEffect, API<br />и useRef</h1>
        <p>10 практических заданий: запросы к API, состояния загрузки, проверка форм и работа с элементами страницы.</p>
        <div className="hero-meta"><span>10 заданий</span><span>React + Vite</span><span>Без ключей доступа</span></div>
      </div>
    </header>
    <main className="layout">
      <aside className="sidebar">
        <h2>Задания</h2>
        <nav aria-label="Список заданий">{tasks.map((task, i) => <button key={task} className={`nav-item ${active === i ? 'selected' : ''}`} onClick={() => setActive(i)}><span className="nav-number">{String(i + 1).padStart(2, '0')}</span><span>{task}</span></button>)}</nav>
        <div className="sidebar-note"><strong>Подсказка</strong><p>Каждое задание можно открыть отдельно. Для работы с API требуется интернет.</p></div>
      </aside>
      <div className="content"><div className="content-top"><span>ЗАДАНИЕ {String(active + 1).padStart(2, '0')} / 10</span><span>{Math.round(((active + 1) / tasks.length) * 100)}% курса</span></div><div className="progress"><span style={{ width: `${((active + 1) / tasks.length) * 100}%` }} /></div><CurrentTask /><div className="task-navigation"><button className="secondary" disabled={active === 0} onClick={() => setActive(a => a - 1)}>← Предыдущее</button><button disabled={active === tasks.length - 1} onClick={() => setActive(a => a + 1)}>Следующее →</button></div></div>
    </main>
    <footer>Учебный проект · Практика хуков React</footer>
  </div>;
}
