import { Link, useNavigate, useParams } from 'react-router-dom';
import { users } from './UsersList.jsx';

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = users.find((item) => item.id === Number(userId));

  if (!user) {
    return <section className="panel not-found-card"><span className="eyebrow">404 · USER</span><h1>Пользователь не найден</h1><p>Профиля с ID {userId} нет в демонстрационном списке.</p><button className="button button-primary" type="button" onClick={() => navigate('/users')}>Вернуться к списку</button></section>;
  }

  return (
    <section className="page-section">
      <div className="breadcrumbs"><Link to="/">Главная</Link><span>/</span><Link to="/users">Пользователи</Link><span>/</span><strong>{user.name}</strong></div>
      <article className="panel profile-card">
        <div className={`avatar avatar-large avatar-${user.color}`}>{user.initials}</div>
        <span className="eyebrow">ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ · ID {user.id}</span>
        <h1>{user.name}</h1>
        <p className="profile-role">{user.role}</p>
        <div className="profile-details"><div><span>Email</span><strong>{user.email}</strong></div><div><span>Город</span><strong>{user.city}</strong></div><div><span>ID маршрута</span><strong>/users/{user.id}</strong></div></div>
        <div className="profile-actions"><button className="button button-quiet" type="button" onClick={() => navigate(-1)}>← Назад</button><Link className="button button-primary" to="/users">Все пользователи</Link></div>
      </article>
    </section>
  );
}
