const FILTERS = [
  { key: 'all', label: 'Все' },
  { key: 'active', label: 'Активные' },
  { key: 'done', label: 'Выполненные' },
];

function Filters({ current, onChange, counts }) {
  return (
    <div className="status-filters" aria-label="Фильтр по статусу">
      {FILTERS.map((filter) => (
        <button
          key={filter.key}
          className={`filter-chip ${current === filter.key ? 'is-active' : ''}`}
          type="button"
          aria-pressed={current === filter.key}
          onClick={() => onChange(filter.key)}
        >
          {filter.label}
          <span className="filter-chip__count">{counts[filter.key]}</span>
        </button>
      ))}
    </div>
  );
}

export default Filters;
