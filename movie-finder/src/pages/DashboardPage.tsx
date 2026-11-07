import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMovies } from '../data/movies';
import { useFavorites } from '../context/FavoritesContext';
import MoviePoster from '../components/MoviePoster';

const genreLabels: Record<string, string> = {
  'Sci-Fi': 'Фантастика',
  Drama: 'Драма',
  Comedy: 'Комедия',
  Thriller: 'Триллер',
  Action: 'Боевик',
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { favorites, watched } = useFavorites();

  const { data: movies = [], isLoading } = useQuery({
    queryKey: ['movies', ''],
    queryFn: () => getMovies(''),
  });

  const stats = useMemo(() => {
    const watchedCount = movies.filter((movie) => watched.includes(movie.id)).length;
    const byGenre: Record<string, number> = {};
    for (const movie of movies) byGenre[movie.genre] = (byGenre[movie.genre] || 0) + 1;
    return {
      total: movies.length,
      watchedCount,
      activeCount: Math.max(0, movies.length - watchedCount),
      byGenre,
    };
  }, [movies, watched]);

  const recentMovies = movies.slice(0, 4);

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="hero-content">
          <span className="eyebrow">ВАША ЛИЧНАЯ КИНОТЕКА</span>
          <h1>Истории, к которым хочется возвращаться.</h1>
          <p>Собирайте любимые фильмы, отмечайте просмотренное и находите следующую историю в собственной библиотеке.</p>
          <button type="button" className="btn btn-primary hero-button" onClick={() => navigate('/movies')}>
            Открыть библиотеку <span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-art-disc" />
          <div className="hero-art-frame"><span>MF</span><small>THE ART OF CINEMA</small></div>
          <div className="hero-art-line" />
        </div>
        <div className="hero-index">01 / YOUR COLLECTION</div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ВАША СТАТИСТИКА</span>
            <h2>Коллекция в цифрах</h2>
          </div>
          <span className="section-note">Данные обновляются автоматически</span>
        </div>

        <div className="stats-grid">
          <article className="stat-card stat-card-featured">
            <span className="stat-label">Всего фильмов</span>
            <strong className="stat-value">{isLoading ? '—' : stats.total}</strong>
            <span className="stat-footnote">В вашей библиотеке</span>
          </article>
          <article className="stat-card">
            <span className="stat-label">Просмотрено</span>
            <strong className="stat-value">{isLoading ? '—' : stats.watchedCount}</strong>
            <span className="stat-footnote">Фильмов уже посмотрели</span>
          </article>
          <article className="stat-card">
            <span className="stat-label">К просмотру</span>
            <strong className="stat-value">{isLoading ? '—' : stats.activeCount}</strong>
            <span className="stat-footnote">Ждут своего вечера</span>
          </article>
          <article className="stat-card">
            <span className="stat-label">Избранное</span>
            <strong className="stat-value">{favorites.length}</strong>
            <span className="stat-footnote">Особенно важные истории</span>
          </article>
        </div>
      </section>

      <section className="section-block dashboard-lower-grid">
        <div className="dashboard-panel genre-panel">
          <div className="section-heading compact-heading">
            <div>
              <span className="eyebrow">КАТЕГОРИИ</span>
              <h2>Жанры библиотеки</h2>
            </div>
          </div>
          <div className="genre-list">
            {Object.entries(stats.byGenre).map(([genre, count]) => (
              <div className="genre-row" key={genre}>
                <span>{genreLabels[genre] ?? genre}</span>
                <strong>{count}</strong>
                <span className="genre-bar"><span style={{ width: `${stats.total ? (count / stats.total) * 100 : 0}%` }} /></span>
              </div>
            ))}
            {!isLoading && Object.keys(stats.byGenre).length === 0 && <p className="empty-note">В библиотеке пока нет фильмов.</p>}
          </div>
          <Link to="/movies" className="inline-link">Перейти к жанрам <span aria-hidden="true">→</span></Link>
        </div>

        <div className="dashboard-panel recent-panel">
          <div className="section-heading compact-heading">
            <div>
              <span className="eyebrow">НАЧНИТЕ С ЭТОГО</span>
              <h2>В библиотеке</h2>
            </div>
            <Link to="/movies" className="inline-link">Все фильмы</Link>
          </div>
          <div className="recent-movies">
            {recentMovies.map((movie) => (
              <Link to={`/movies/${movie.id}`} className="recent-movie" key={movie.id}>
                <MoviePoster movie={movie} />
                <span className="recent-movie-info">
                  <strong>{movie.title}</strong>
                  <small>{movie.year} · {genreLabels[movie.genre] ?? movie.genre}</small>
                </span>
                <span className="recent-rating">{movie.rating.toFixed(1)}</span>
              </Link>
            ))}
            {!isLoading && recentMovies.length === 0 && <p className="empty-note">Добавьте первый фильм в свою библиотеку.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
