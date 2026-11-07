import { Link } from 'react-router-dom';

// Страница 404 рендерится вне Layout (без шапки), согласно требованиям 14_.md
export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--accent)' }}>
        404
      </div>
      <h1 style={{ margin: '8px 0 12px' }}>Страница не найдена</h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: 420, marginBottom: 24 }}>
        Такого маршрута в каталоге фильмов не существует. Проверьте адрес или вернитесь на главную.
      </p>
      <Link to="/" className="btn btn-primary">
        ← Вернуться на главную
      </Link>
    </div>
  );
}
