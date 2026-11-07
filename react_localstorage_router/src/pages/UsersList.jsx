import { Link, useSearchParams } from 'react-router-dom';

const users = [
  { id: 1, name: 'Анна Смирнова', email: 'anna@example.com', city: 'Москва', role: 'Frontend-разработчик', initials: 'АС', color: 'lavender' },
  { id: 2, name: 'Пётр Волков', email: 'petr@example.com', city: 'Санкт-Петербург', role: 'UI-дизайнер', initials: 'ПВ', color: 'mint' },
  { id: 3, name: 'Мария Кузнецова', email: 'maria@example.com', city: 'Казань', role: 'QA-инженер', initials: 'МК', color: 'peach' },
  { id: 4, name: 'Илья Морозов', email: 'ilya@example.com', city: 'Москва', role: 'React-разработчик', initials: 'ИМ', color: 'blue' },
];

const cities = ['Москва', 'Санкт-Петербург', 'Казань'];

export { users };

export default function UsersList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCity = searchParams.get('city') ?? 'all';
  const filteredUsers = selectedCity === 'all'
    ? users
    : users.filter((user) => user.city === selectedCity);

  function handleCityChange(event) {
    const city = event.target.value;
    const nextParams = new URLSearchParams(searchParams);
    if (city === 'all') nextParams.delete('city');
    else nextParams.set('city', city);
    setSearchParams(nextParams);
  }

  return (
    <section className="page-section">
      <div className="page-heading split-heading"><div><span className="eyebrow">REACT ROUTER · useParams</span><h1>Пользователи</h1><p>Открой карточку, чтобы перейти на динамический маршрут профиля.</p></div><label className="select-filter"><span>Фильтр по городу</span><select value={selectedCity} onChange={handleCityChange}><option value="all">Все города</option>{cities.map((city) => <option key={city} value={city}>{city}</option>)}</select></label></div>
      <div className="users-grid">
        {filteredUsers.map((user) => (
          <article className="panel user-card" key={user.id}>
            <div className={`avatar avatar-${user.color}`}>{user.initials}</div>
            <div className="user-card-main"><h2>{user.name}</h2><p>{user.role}</p><span className="user-city">⌖ {user.city}</span></div>
            <Link className="user-open-link" to={`/users/${user.id}`} aria-label={`Открыть профиль: ${user.name}`}>→</Link>
          </article>
        ))}
      </div>
      {!filteredUsers.length && <div className="panel empty-state">В этом городе пока нет пользователей.</div>}
      <p className="query-hint">Текущий URL отражает фильтр: <code>{selectedCity === 'all' ? '/users' : `/users?city=${encodeURIComponent(selectedCity)}`}</code></p>
    </section>
  );
}
