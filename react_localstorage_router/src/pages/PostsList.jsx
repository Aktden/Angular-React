import { Link } from 'react-router-dom';

export const posts = [
  { id: 1, title: 'Как работает localStorage в браузере', category: 'JavaScript', date: '12 марта 2026', excerpt: 'Разбираемся с ключами и значениями, JSON-сериализацией и безопасной обработкой ошибок.' },
  { id: 2, title: 'Первые шаги с React Router', category: 'React', date: '18 марта 2026', excerpt: 'Настраиваем BrowserRouter, Routes и Route, а затем добавляем навигацию между страницами.' },
  { id: 3, title: 'Динамические маршруты и параметры', category: 'Практика', date: '24 марта 2026', excerpt: 'Используем useParams, вложенные маршруты и общие layout-компоненты.' },
];

export default function PostsList() {
  return (
    <section className="page-section">
      <div className="page-heading"><span className="eyebrow">ДЕМО · /posts</span><h1>Публикации</h1><p>Пример списка и динамической страницы материала по адресу /posts/:id.</p></div>
      <div className="posts-list">
        {posts.map((post) => <article className="panel post-card" key={post.id}><div className="post-meta"><span>{post.category}</span><time>{post.date}</time></div><h2>{post.title}</h2><p>{post.excerpt}</p><Link to={`/posts/${post.id}`}>Читать публикацию <span>→</span></Link></article>)}
      </div>
    </section>
  );
}
