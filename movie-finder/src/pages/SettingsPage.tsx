import { useQueryClient } from '@tanstack/react-query';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { favorites, watched, resetAllStorage } = useFavorites();
  const queryClient = useQueryClient();

  function handleReset() {
    if (window.confirm('Сбросить пользовательские данные и восстановить стартовую коллекцию фильмов?')) {
      resetAllStorage();
      queryClient.resetQueries({ queryKey: ['movies'] });
    }
  }

  return (
    <div className="settings-page">
      <div className="page-heading-row">
        <div>
          <span className="eyebrow">ПЕРСОНАЛИЗАЦИЯ</span>
          <h1 className="page-title">Настройки</h1>
          <p className="page-subtitle">Управляйте оформлением и данными вашей личной библиотеки.</p>
        </div>
      </div>

      <section className="settings-card">
        <div className="settings-card-copy">
          <span className="eyebrow">ВНЕШНИЙ ВИД</span>
          <h2>Тема оформления</h2>
          <p>Выберите комфортный режим интерфейса. Настройка сохраняется в браузере.</p>
        </div>
        <div className="theme-choice">
          <span className={`theme-preview theme-preview-dark ${theme === 'dark' ? 'chosen' : ''}`}>
            <span /><span /><span />
          </span>
          <span className={`theme-preview theme-preview-light ${theme === 'light' ? 'chosen' : ''}`}>
            <span /><span /><span />
          </span>
          <button type="button" className="btn btn-secondary" onClick={toggleTheme}>
            Включить {theme === 'dark' ? 'светлую' : 'тёмную'} тему
          </button>
        </div>
      </section>

      <section className="settings-card settings-data-card">
        <div className="settings-card-copy">
          <span className="eyebrow">ЛОКАЛЬНЫЕ ДАННЫЕ</span>
          <h2>Хранение библиотеки</h2>
          <p>Фильмы, избранное и статусы просмотра хранятся в localStorage этого браузера. Внешние API для поиска не используются.</p>
          <div className="settings-counts">
            <span><strong>{favorites.length}</strong> в избранном</span>
            <span><strong>{watched.length}</strong> просмотрено</span>
          </div>
        </div>
        <button type="button" className="btn btn-danger" onClick={handleReset}>Сбросить данные</button>
      </section>

      <p className="settings-footnote">Сброс удалит добавленные вами фильмы, изменения, избранное и статусы просмотра. Стартовая коллекция будет восстановлена.</p>
    </div>
  );
}
