import { useEffect, useMemo, useState } from 'react';
import TodoForm from './components/TodoForm';
import Filters from './components/Filters';
import TodoList from './components/TodoList';
import ProgressBar from './components/ProgressBar';
import Exercises from './components/Exercises';

const STORAGE_KEY = 'focus-todo-items';

const INITIAL_TODOS = [
  {
    id: 'seed-1',
    text: 'Изучить useState',
    done: true,
    priority: 'high',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: 'seed-2',
    text: 'Разобраться со списками',
    done: false,
    priority: 'medium',
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: 'seed-3',
    text: 'Сделать todo-приложение',
    done: false,
    priority: 'low',
    createdAt: Date.now(),
  },
];

function readTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return INITIAL_TODOS;

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return INITIAL_TODOS;

    return parsed
      .filter(
        (todo) =>
          todo &&
          (typeof todo.id === 'string' || typeof todo.id === 'number') &&
          typeof todo.text === 'string' &&
          typeof todo.done === 'boolean'
      )
      .map((todo) => ({
        id: String(todo.id),
        text: todo.text,
        done: todo.done,
        priority: ['low', 'medium', 'high'].includes(todo.priority)
          ? todo.priority
          : 'medium',
        createdAt: Number.isFinite(todo.createdAt) ? todo.createdAt : Date.now(),
      }));
  } catch {
    return INITIAL_TODOS;
  }
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function App() {
  const [todos, setTodos] = useState(readTodos);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState('date');
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('focus-todo-theme') === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });
  const [activePage, setActivePage] = useState('todos');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // Приложение продолжает работать, даже если хранилище недоступно.
    }
  }, [todos]);

  useEffect(() => {
    try {
      localStorage.setItem('focus-todo-theme', theme);
    } catch {
      // Тема останется активной до перезагрузки страницы.
    }
  }, [theme]);

  const counts = useMemo(
    () => ({
      all: todos.length,
      active: todos.filter((todo) => !todo.done).length,
      done: todos.filter((todo) => todo.done).length,
    }),
    [todos]
  );

  const visibleTodos = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('ru');

    const filtered = todos.filter((todo) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && !todo.done) ||
        (statusFilter === 'done' && todo.done);

      const matchesPriority =
        priorityFilter === 'all' || todo.priority === priorityFilter;

      const matchesSearch =
        !normalizedSearch ||
        todo.text.toLocaleLowerCase('ru').includes(normalizedSearch);

      return matchesStatus && matchesPriority && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortMode === 'alphabetical') {
        return a.text.localeCompare(b.text, 'ru', { sensitivity: 'base' });
      }
      return b.createdAt - a.createdAt;
    });
  }, [todos, statusFilter, priorityFilter, search, sortMode]);

  function addTodo({ text, priority }) {
    const newTodo = {
      id: createId(),
      text,
      priority,
      done: false,
      createdAt: Date.now(),
    };
    setTodos((previous) => [...previous, newTodo]);
  }

  function toggleTodo(id) {
    setTodos((previous) =>
      previous.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  }

  function deleteTodo(id) {
    setTodos((previous) => previous.filter((todo) => todo.id !== id));
  }

  function editTodo(id, newText) {
    setTodos((previous) =>
      previous.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  }

  function toggleAll() {
    const shouldComplete = todos.some((todo) => !todo.done);
    setTodos((previous) =>
      previous.map((todo) => ({ ...todo, done: shouldComplete }))
    );
  }

  function deleteCompleted() {
    setTodos((previous) => previous.filter((todo) => !todo.done));
  }

  function clearAll() {
    if (todos.length === 0) return;
    const confirmed = window.confirm('Удалить все задачи? Это действие нельзя отменить.');
    if (confirmed) setTodos([]);
  }

  function toggleTheme() {
    setTheme((previous) => (previous === 'light' ? 'dark' : 'light'));
  }

  return (
    <div className="app-shell" data-theme={theme}>
      <div className="app-container">
        <header className="topbar">
          <a className="brand" href="#" onClick={(event) => event.preventDefault()} aria-label="Focus — главная">
            <span className="brand__mark">✓</span>
            <span>focus<span className="brand__dot">.</span></span>
          </a>

          <nav className="main-nav" aria-label="Главная навигация">
            <button
              className={`nav-link ${activePage === 'todos' ? 'is-active' : ''}`}
              type="button"
              onClick={() => setActivePage('todos')}
            >
              Мои задачи
            </button>
            <button
              className={`nav-link ${activePage === 'exercises' ? 'is-active' : ''}`}
              type="button"
              onClick={() => setActivePage('exercises')}
            >
              Упражнения
            </button>
          </nav>

          <button className="theme-button" type="button" onClick={toggleTheme} aria-label="Переключить тему">
            <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
            <span className="theme-button__label">{theme === 'dark' ? 'Светлая' : 'Тёмная'}</span>
          </button>
        </header>

        {activePage === 'todos' ? (
          <main className="todo-page">
            <section className="hero">
              <div>
                <span className="eyebrow">Планируй. Делай. Завершай.</span>
                <h1>Твои задачи,<br /><span>под контролем.</span></h1>
                <p>Собери мысли в список и двигайся к результату по одному делу за раз.</p>
              </div>
              <div className="hero-art" aria-hidden="true">
                <div className="hero-art__circle hero-art__circle--one" />
                <div className="hero-art__circle hero-art__circle--two" />
                <div className="hero-art__check">✓</div>
                <div className="hero-art__spark hero-art__spark--one">✦</div>
                <div className="hero-art__spark hero-art__spark--two">✧</div>
              </div>
            </section>

            <div className="dashboard-grid">
              <section className="panel tasks-panel">
                <div className="panel__heading">
                  <div>
                    <span className="eyebrow">Твой список</span>
                    <h2>Задачи</h2>
                  </div>
                  <span className="total-badge">{todos.length} всего</span>
                </div>

                <TodoForm onAdd={addTodo} />

                <div className="filter-toolbar">
                  <Filters current={statusFilter} onChange={setStatusFilter} counts={counts} />
                  <label className="sr-only" htmlFor="priority-filter">Фильтр по приоритету</label>
                  <select
                    id="priority-filter"
                    className="field priority-filter"
                    value={priorityFilter}
                    onChange={(event) => setPriorityFilter(event.target.value)}
                  >
                    <option value="all">Все приоритеты</option>
                    <option value="high">Высокий</option>
                    <option value="medium">Средний</option>
                    <option value="low">Низкий</option>
                  </select>
                </div>

                <div className="list-toolbar">
                  <label className="search-field">
                    <span aria-hidden="true">⌕</span>
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Поиск задач…"
                      aria-label="Поиск задач"
                    />
                    {search && (
                      <button type="button" onClick={() => setSearch('')} aria-label="Очистить поиск">
                        ×
                      </button>
                    )}
                  </label>
                  <button
                    className="sort-button"
                    type="button"
                    onClick={() => setSortMode((previous) => previous === 'date' ? 'alphabetical' : 'date')}
                    title="Переключить сортировку"
                  >
                    <span aria-hidden="true">↕</span>
                    {sortMode === 'date' ? 'По дате' : 'По алфавиту'}
                  </button>
                </div>

                <TodoList
                  todos={visibleTodos}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onEdit={editTodo}
                  hasAnyTodos={todos.length > 0}
                  hasActiveFilters={Boolean(search.trim()) || statusFilter !== 'all' || priorityFilter !== 'all'}
                />

                <div className="bulk-actions">
                  <button
                    className="text-action"
                    type="button"
                    onClick={toggleAll}
                    disabled={todos.length === 0}
                  >
                    {todos.length > 0 && todos.every((todo) => todo.done) ? 'Снять отметки' : 'Отметить все'}
                  </button>
                  <span className="bulk-actions__separator" />
                  <button
                    className="text-action"
                    type="button"
                    onClick={deleteCompleted}
                    disabled={counts.done === 0}
                  >
                    Удалить выполненные
                  </button>
                  <span className="bulk-actions__separator" />
                  <button
                    className="text-action text-action--danger"
                    type="button"
                    onClick={clearAll}
                    disabled={todos.length === 0}
                  >
                    Очистить всё
                  </button>
                </div>
              </section>

              <aside className="side-column">
                <ProgressBar done={counts.done} total={counts.all} />

                <section className="summary-card">
                  <span className="eyebrow">Сводка</span>
                  <h3>Небольшие шаги — большой результат.</h3>
                  <div className="summary-stats">
                    <div>
                      <strong>{counts.active}</strong>
                      <span>Активные</span>
                    </div>
                    <div>
                      <strong>{counts.done}</strong>
                      <span>Готово</span>
                    </div>
                  </div>
                </section>

                <section className="tip-card">
                  <span className="tip-card__icon" aria-hidden="true">✦</span>
                  <div>
                    <strong>Подсказка</strong>
                    <p>Дважды щёлкни по названию задачи или нажми на него, чтобы отредактировать.</p>
                  </div>
                </section>
              </aside>
            </div>
          </main>
        ) : (
          <main>
            <Exercises theme={theme} onToggleTheme={toggleTheme} />
          </main>
        )}

        <footer className="footer">
          <span>FOCUS · React practice project</span>
          <span>Сделано для продуктивных дней</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
