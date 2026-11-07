import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="panel not-found-card">
      <span className="eyebrow">ОШИБКА МАРШРУТА</span>
      <strong className="not-found-code">404</strong>
      <h1>Страница не найдена</h1>
      <p>Проверь адрес или вернись на главную страницу.</p>
      <Link className="button button-primary" to="/">На главную <span>→</span></Link>
    </section>
  );
}
