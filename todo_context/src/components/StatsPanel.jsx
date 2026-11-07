import { memo, useMemo } from 'react';
import { useTasks } from '../hooks/useTasks.js';
import { usePrevious } from '../hooks/usePrevious.js';

const StatsPanel = memo(function StatsPanel() {
  const tasks = useTasks();

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.done).length;
    const total = tasks.length;

    return {
      total,
      completed,
      active: total - completed,
      progress: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  }, [tasks]);

  const previousTotal = usePrevious(stats.total);

  return (
    <section className="stats-grid" aria-label="Статистика задач">
      <article className="stat-card stat-card-primary">
        <div className="stat-topline">
          <span className="stat-label">ВСЕГО ЗАДАЧ</span>
          <span className="stat-icon stat-icon-violet" aria-hidden="true">▤</span>
        </div>
        <div className="stat-value">{stats.total.toString().padStart(2, '0')}</div>
        <div className="stat-foot">
          {previousTotal === undefined
            ? 'Твой список начинается здесь'
            : `В прошлый раз: ${previousTotal}`}
        </div>
      </article>

      <article className="stat-card">
        <div className="stat-topline">
          <span className="stat-label">ОСТАЛОСЬ</span>
          <span className="stat-icon stat-icon-blue" aria-hidden="true">◷</span>
        </div>
        <div className="stat-value">{stats.active.toString().padStart(2, '0')}</div>
        <div className="stat-foot">Задач ждут внимания</div>
      </article>

      <article className="stat-card">
        <div className="stat-topline">
          <span className="stat-label">ВЫПОЛНЕНО</span>
          <span className="stat-icon stat-icon-green" aria-hidden="true">✓</span>
        </div>
        <div className="stat-value">{stats.completed.toString().padStart(2, '0')}</div>
        <div className="stat-foot progress-foot">
          <span>{stats.progress}% прогресса</span>
          <span className="progress-track" aria-label={`Выполнено ${stats.progress}%`}>
            <span style={{ width: `${stats.progress}%` }} />
          </span>
        </div>
      </article>
    </section>
  );
});

export default StatsPanel;
