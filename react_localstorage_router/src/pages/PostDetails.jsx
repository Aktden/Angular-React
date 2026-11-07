import { Link, useNavigate, useParams } from 'react-router-dom';
import { posts } from './PostsList.jsx';

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = posts.find((item) => item.id === Number(id));

  if (!post) {
    return <section className="panel not-found-card"><span className="eyebrow">404 · POST</span><h1>Публикация не найдена</h1><p>Материал с ID {id} отсутствует.</p><Link className="button button-primary" to="/posts">К списку публикаций</Link></section>;
  }

  return (
    <article className="panel article-card">
      <div className="breadcrumbs"><Link to="/">Главная</Link><span>/</span><Link to="/posts">Публикации</Link><span>/</span><strong>Материал {post.id}</strong></div>
      <div className="post-meta"><span>{post.category}</span><time>{post.date}</time></div>
      <h1>{post.title}</h1>
      <p className="article-lead">{post.excerpt}</p>
      <div className="article-body"><p>Это демонстрационная страница, открытая по динамическому URL. Значение параметра <code>id</code> берётся из адресной строки с помощью хука <code>useParams()</code>.</p><p>В настоящем приложении здесь можно загрузить публикацию из API или базы данных. Сейчас данные находятся в массиве в памяти, чтобы сосредоточиться на механике маршрутизации.</p></div>
      <button className="button button-quiet" type="button" onClick={() => navigate(-1)}>← Назад к публикациям</button>
    </article>
  );
}
