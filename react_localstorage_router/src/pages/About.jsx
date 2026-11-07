import { Link } from 'react-router-dom';

const topics = [
  { number: '01', title: 'localStorage', text: 'Чтение данных при первом рендере, JSON.parse / JSON.stringify и обработка ошибок через try/catch.' },
  { number: '02', title: 'Кастомный хук', text: 'Переиспользуемый useLocalStorage синхронизирует состояние React с браузерным хранилищем.' },
  { number: '03', title: 'React Router', text: 'Маршруты, NavLink, useNavigate, динамические параметры и вложенный layout через Outlet.' },
  { number: '04', title: 'Практика', text: 'Фильтрация, защищённый маршрут, query-параметры и debounce для автосохранения заметки.' },
];

export default function About() {
  return (
    <section className="page-section">
      <div className="page-heading"><span className="eyebrow">О ПРОЕКТЕ</span><h1>Практика двух важных<br /><span>возможностей React.</span></h1><p>Небольшое приложение, в котором теория из частей 7 и 8 собрана в работающий интерфейс.</p></div>
      <div className="topic-grid">
        {topics.map((topic) => <article className="panel topic-card" key={topic.number}><span className="topic-number">{topic.number}</span><h2>{topic.title}</h2><p>{topic.text}</p></article>)}
      </div>
      <section className="panel about-callout"><div><span className="eyebrow">ГОТОВ К ПРОВЕРКЕ</span><h2>Начни с главной страницы</h2><p>Добавь несколько задач, обнови страницу и убедись, что данные остались на месте.</p></div><Link className="button button-primary" to="/">На главную <span>→</span></Link></section>
    </section>
  );
}
