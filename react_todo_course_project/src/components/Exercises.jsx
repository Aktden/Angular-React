import { useState } from 'react';

function CounterExercise() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  function updateCount(direction) {
    setCount((previous) => previous + direction * step);
  }

  return (
    <section className="exercise-card">
      <div className="exercise-card__heading">
        <span className="exercise-number">01</span>
        <div>
          <h3>Счётчик с шагом</h3>
          <p>Изменяй значение на выбранное количество.</p>
        </div>
      </div>
      <div className="counter-display">{count}</div>
      <label className="control-label" htmlFor="counter-step">Шаг изменения</label>
      <input
        id="counter-step"
        className="field exercise-field"
        type="number"
        min="1"
        max="100"
        value={step}
        onChange={(event) => {
          const next = Number(event.target.value);
          setStep(Number.isFinite(next) && next > 0 ? Math.min(next, 100) : 1);
        }}
      />
      <div className="exercise-actions">
        <button className="button button--secondary" type="button" onClick={() => updateCount(-1)}>
          − Уменьшить
        </button>
        <button className="button button--primary" type="button" onClick={() => updateCount(1)}>
          ＋ Увеличить
        </button>
        <button className="button button--ghost" type="button" onClick={() => setCount(0)}>
          Сбросить
        </button>
      </div>
    </section>
  );
}

function LoginExercise() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    window.alert(`Демонстрационная форма отправлена.\nEmail: ${email}`);
  }

  return (
    <section className="exercise-card">
      <div className="exercise-card__heading">
        <span className="exercise-number">02</span>
        <div>
          <h3>Форма логина</h3>
          <p>Кнопка активна, когда оба поля заполнены.</p>
        </div>
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="control-label" htmlFor="login-email">Email</label>
        <input
          id="login-email"
          className="field"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <label className="control-label" htmlFor="login-password">Пароль</label>
        <input
          id="login-password"
          className="field"
          type="password"
          autoComplete="current-password"
          placeholder="Введите пароль"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button className="button button--primary" type="submit" disabled={!email.trim() || !password.trim()}>
          Войти
        </button>
      </form>
      <p className="helper-note">Это учебная форма: данные никуда не отправляются.</p>
    </section>
  );
}

function ShoppingListExercise() {
  const [value, setValue] = useState('');
  const [items, setItems] = useState([]);

  function handleAdd(event) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;

    setItems((previous) => [
      ...previous,
      { id: `${Date.now()}-${Math.random()}`, name: trimmed },
    ]);
    setValue('');
  }

  function handleDelete(id) {
    setItems((previous) => previous.filter((item) => item.id !== id));
  }

  return (
    <section className="exercise-card">
      <div className="exercise-card__heading">
        <span className="exercise-number">03</span>
        <div>
          <h3>Список покупок</h3>
          <p>Добавляй товары и удаляй ненужные.</p>
        </div>
      </div>
      <form className="shopping-form" onSubmit={handleAdd}>
        <input
          className="field"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Например, молоко"
          aria-label="Название товара"
          maxLength={100}
        />
        <button className="button button--primary" type="submit" disabled={!value.trim()}>
          Добавить
        </button>
      </form>
      {items.length === 0 ? (
        <p className="helper-note">Список пока пуст.</p>
      ) : (
        <ul className="shopping-list">
          {items.map((item) => (
            <li key={item.id}>
              <span>{item.name}</span>
              <button
                className="icon-button icon-button--danger"
                type="button"
                onClick={() => handleDelete(item.id)}
                aria-label={`Удалить ${item.name}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Exercises({ theme, onToggleTheme }) {
  return (
    <div className="exercises-page">
      <div className="page-intro">
        <span className="eyebrow">Практика · Части 3–4</span>
        <h2>Дополнительные упражнения</h2>
        <p>Небольшие примеры для закрепления состояния, событий и управляемых компонентов.</p>
      </div>

      <div className="exercise-grid">
        <CounterExercise />
        <section className="exercise-card">
          <div className="exercise-card__heading">
            <span className="exercise-number">04</span>
            <div>
              <h3>Переключатель темы</h3>
              <p>Тема меняет фон и цвет интерфейса всего приложения.</p>
            </div>
          </div>
          <div className="theme-preview">
            <span className={`theme-preview__dot theme-preview__dot--${theme}`} />
            <div>
              <strong>{theme === 'dark' ? 'Тёмная тема' : 'Светлая тема'}</strong>
              <span>Текущее оформление</span>
            </div>
          </div>
          <button className="button button--secondary" type="button" onClick={onToggleTheme}>
            {theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
          </button>
        </section>
        <LoginExercise />
        <ShoppingListExercise />
      </div>
    </div>
  );
}

export default Exercises;
