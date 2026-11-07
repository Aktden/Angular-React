import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/', label: 'Главная', end: true },
  { to: '/about', label: 'О проекте' },
  { to: '/users', label: 'Пользователи' },
  { to: '/posts', label: 'Блог' },
  { to: '/admin', label: 'Админка' },
];

export default function AppLayout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink className="brand" to="/" end>
            <span className="brand-mark">R</span>
            <span>React<span className="brand-muted">Lab</span></span>
          </NavLink>
          <nav className="main-nav" aria-label="Основная навигация">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="page-container">
        <Outlet />
      </main>

      <footer className="footer">
        <span>React Lab</span>
        <span>Учебный проект · localStorage + React Router</span>
      </footer>
    </div>
  );
}
