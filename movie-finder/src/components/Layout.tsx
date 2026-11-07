import { NavLink, Outlet } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';

export default function Layout() {
  const { favorites, watched } = useFavorites();
  const { theme, toggleTheme } = useTheme();

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'nav-link active' : 'nav-link';

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <NavLink to="/" className="brand-logo" aria-label="MovieFinder — главная">
            <span className="brand-mark">M</span>
            <span className="brand-name">movie<span>finder</span></span>
          </NavLink>

          <nav className="nav-links" aria-label="Основная навигация">
            <NavLink to="/" className={getNavClass} end>Обзор</NavLink>
            <NavLink to="/movies" className={getNavClass}>Библиотека</NavLink>
            <NavLink to="/settings" className={getNavClass}>Настройки</NavLink>
          </nav>

          <div className="header-actions">
            <div className="header-stat" title="Количество фильмов в избранном">
              <span className="header-stat-value">{favorites.length}</span>
              <span>Избранное</span>
            </div>
            <div className="header-stat" title="Количество просмотренных фильмов">
              <span className="header-stat-value">{watched.length}</span>
              <span>Просмотрено</span>
            </div>
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
              title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
            >
              <span className="theme-toggle-indicator" />
              {theme === 'dark' ? 'Тёмная тема' : 'Светлая тема'}
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <span>MovieFinder</span>
        <span>Ваша личная коллекция кино · Данные хранятся на этом устройстве</span>
      </footer>
    </div>
  );
}
