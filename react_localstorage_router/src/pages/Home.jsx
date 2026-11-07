import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import TodoForm from '../components/TodoForm.jsx';
import TodoItem from '../components/TodoItem.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const TODOS_KEY = 'react-lab-todos-v1';
const THEME_KEY = 'react-lab-theme-v1';
const COUNTER_KEY = 'react-lab-counter-v1';
const NOTE_KEY = 'react-lab-note-v1';

function readNote() {
  try {
    return window.localStorage.getItem(NOTE_KEY) ?? '';
  } catch (error) {
    console.warn('Не удалось прочитать черновик заметки', error);
    return '';
  }
}

export default function Home() {
  const [todos, setTodos] = useLocalStorage(TODOS_KEY, []);
  const [theme, setTheme] = useLocalStorage(THEME_KEY, 'light');
  const [counter, setCounter] = useLocalStorage(COUNTER_KEY, 0);
  const [filter, setFilter] = useState('all');
  const [note, setNote] = useState(readNote);
  const [noteStatus, setNoteStatus] = useState('Сохранено');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Упражнение: автосохранение заметки с debounce 500 мс.
  useEffect(() => {
    setNoteStatus('Сохранение…');
    const timeoutId = window.setTimeout(() => {
      try {
        window.localStorage.setItem(NOTE_KEY, note);
        setNoteStatus('Сохранено');
      } catch (error) {
        console.warn('Не удалось сохранить заметку', error);
        setNoteStatus('Не удалось сохранить');
      }
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [note]);

  const doneCount = todos.filter((todo) => todo.done).length;
  const activeCount = todos.length - doneCount;
  const visibleTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((todo) => !todo.done);
    if (filter === 'done') return todos.filter((todo) => todo.done);
    return todos;
  }, [filter, todos]);

  function addTodo(text) {
    const id = globalThis.crypto?.randomUUID?.()
      ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setTodos((currentTodos) => [...currentTodos, { id, text, done: false }]);
  }

  function toggleTodo(id) {
    setTodos((currentTodos) => currentTodos.map((todo) => (
      todo.id === id ? { ...todo, done: !todo.done } : todo
    )));
  }

  function deleteTodo(id) {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  }

  function clearAll() {
    if (todos.length && window.confirm('Удалить все задачи? Это действие нельзя отменить.')) {
      setTodos([]);
    }
  }

  function clearCompleted() {
    setTodos((currentTodos) => currentTodos.filter((todo) => !todo.done));
  }

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">ПРАКТИКА REACT · ЧАСТИ 7–8</span>
          <h1>Учись. Делай.<br /><span>Сохраняй результат.</span></h1>
          <p>Мини-проект объединяет постоянное хранение данных в браузере и навигацию между страницами без перезагрузки.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#todo">К списку задач <span aria-hidden="true">↓</span></a>
            <Link className="button button-quiet" to="/users">Открыть роутинг <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-card hero-card-main">
            <span className="hero-card-icon">✓</span>
            <span className="hero-card-line long" />
            <span className="hero-card-line short" />
            <div className="hero-card-bottom"><span /> <span /> <span /></div>
          </div>
          <div className="floating-chip chip-storage"><span>↻</span> localStorage</div>
          <div className="floating-chip chip-router"><span>⌘</span> Router</div>
        </div>
      </section>

      <section className="stats-grid" aria-label="Статистика задач">
        <article className="stat-card">
          <span className="stat-label">Всего задач</span>
          <strong>{todos.length}</strong>
          <span className="stat-hint">В твоём списке</span>
        </article>
        <article className="stat-card">
          <span className="stat-label">Осталось</span>
          <strong>{activeCount}</strong>
          <span className="stat-hint">Ждут выполнения</span>
        </article>
        <article className="stat-card">
          <span className="stat-label">Выполнено</span>
          <strong>{doneCount}</strong>
          <span className="stat-hint">Уже сделано</span>
        </article>
        <article className="stat-card stat-card-accent">
          <span className="stat-label">Прогресс</span>
          <strong>{todos.length ? Math.round((doneCount / todos.length) * 100) : 0}%</strong>
          <div className="progress-track"><span style={{ width: `${todos.length ? (doneCount / todos.length) * 100 : 0}%` }} /></div>
        </article>
      </section>

      <div className="content-grid" id="todo">
        <section className="panel todo-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">ПЛАНИРОВЩИК</span>
              <h2>Мои задачи</h2>
            </div>
            <span className="saved-pill"><span /> Автосохранение</span>
          </div>

          <TodoForm onAdd={addTodo} />

          <div className="todo-toolbar">
            <div className="filter-tabs" role="group" aria-label="Фильтр задач">
              <button className={filter === 'all' ? 'selected' : ''} onClick={() => setFilter('all')} type="button">Все</button>
              <button className={filter === 'active' ? 'selected' : ''} onClick={() => setFilter('active')} type="button">Активные</button>
              <button className={filter === 'done' ? 'selected' : ''} onClick={() => setFilter('done')} type="button">Готово</button>
            </div>
            <span className="muted-text">{activeCount} осталось</span>
          </div>

          {visibleTodos.length ? (
            <ul className="todo-list">
              {visibleTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">✓</span>
              <strong>{filter === 'done' ? 'Пока нет выполненных задач' : filter === 'active' ? 'Активных задач нет' : 'Список пока пуст'}</strong>
              <span>{filter === 'all' ? 'Добавь первую задачу — она останется здесь после перезагрузки.' : 'Попробуй другой фильтр или добавь новую задачу.'}</span>
            </div>
          )}

          <div className="todo-footer">
            <span>Данные хранятся в localStorage</span>
            <div>
              <button className="text-button" type="button" onClick={clearCompleted} disabled={!doneCount}>Удалить выполненные</button>
              <button className="text-button danger-text" type="button" onClick={clearAll} disabled={!todos.length}>Очистить всё</button>
            </div>
          </div>
        </section>

        <aside className="side-column">
          <section className="panel mini-panel">
            <div className="panel-heading compact-heading">
              <div><span className="eyebrow">УПРАЖНЕНИЕ 1</span><h2>Счётчик</h2></div>
              <span className="mini-icon">#</span>
            </div>
            <p className="panel-description">Значение сохраняется после обновления страницы.</p>
            <div className="counter-row">
              <button className="counter-button" type="button" onClick={() => setCounter((value) => value - 1)} aria-label="Уменьшить">−</button>
              <strong>{counter}</strong>
              <button className="counter-button" type="button" onClick={() => setCounter((value) => value + 1)} aria-label="Увеличить">+</button>
            </div>
            <button className="text-button reset-button" type="button" onClick={() => setCounter(0)}>Сбросить счётчик</button>
          </section>

          <section className="panel mini-panel">
            <div className="panel-heading compact-heading">
              <div><span className="eyebrow">УПРАЖНЕНИЕ 2</span><h2>Оформление</h2></div>
              <span className="mini-icon">◐</span>
            </div>
            <p className="panel-description">Выбранная тема запоминается в браузере.</p>
            <div className="theme-switcher">
              <button className={theme === 'light' ? 'theme-option active' : 'theme-option'} onClick={() => setTheme('light')} type="button">☀ Светлая</button>
              <button className={theme === 'dark' ? 'theme-option active' : 'theme-option'} onClick={() => setTheme('dark')} type="button">☾ Тёмная</button>
            </div>
          </section>

          <section className="panel mini-panel note-panel">
            <div className="panel-heading compact-heading">
              <div><span className="eyebrow">УПРАЖНЕНИЕ 3</span><h2>Черновик заметки</h2></div>
              <span className="mini-icon">✎</span>
            </div>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Запиши мысль. Сохранение произойдёт через 500 мс после ввода…"
              rows={4}
            />
            <div className="note-footer"><span>{noteStatus}</span><span>debounce · 500 мс</span></div>
          </section>
        </aside>
      </div>

      <section className="next-steps panel">
        <div><span className="eyebrow">ДАЛЬШЕ ПО ПРОЕКТУ</span><h2>Изучи маршруты приложения</h2><p>Перейди к профилям пользователей, динамическим URL и списку публикаций.</p></div>
        <div className="next-links"><Link to="/users">Пользователи <span>→</span></Link><Link to="/posts">Публикации <span>→</span></Link><Link to="/about">О проекте <span>→</span></Link></div>
      </section>
    </>
  );
}
