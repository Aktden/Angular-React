import { memo } from 'react';

const FILTERS = [
  { value: 'all', label: 'Все' },
  { value: 'active', label: 'Активные' },
  { value: 'done', label: 'Готово' },
];

const TaskToolbar = memo(function TaskToolbar({
  filter,
  onFilterChange,
  query,
  onQueryChange,
  sort,
  onSortChange,
  activeCount,
  completedCount,
  onClearCompleted,
}) {
  return (
    <div className="task-toolbar">
      <div className="toolbar-main">
        <div className="filter-tabs" role="group" aria-label="Фильтр задач">
          {FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`filter-tab ${filter === item.value ? 'is-active' : ''}`}
              onClick={() => onFilterChange(item.value)}
              aria-pressed={filter === item.value}
            >
              {item.label}
              {item.value === 'active' && <span className="filter-count">{activeCount}</span>}
              {item.value === 'done' && <span className="filter-count">{completedCount}</span>}
            </button>
          ))}
        </div>

        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <span className="visually-hidden">Поиск по задачам</span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Найти задачу"
          />
          {query && (
            <button
              type="button"
              className="clear-search"
              onClick={() => onQueryChange('')}
              aria-label="Очистить поиск"
            >
              ×
            </button>
          )}
        </label>
      </div>

      <div className="toolbar-bottom">
        <label className="sort-control">
          <span>Сортировка</span>
          <select value={sort} onChange={(event) => onSortChange(event.target.value)}>
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
          </select>
        </label>

        <button
          type="button"
          className="clear-completed"
          onClick={onClearCompleted}
          disabled={completedCount === 0}
        >
          Удалить выполненные
        </button>
      </div>
    </div>
  );
});

export default TaskToolbar;
