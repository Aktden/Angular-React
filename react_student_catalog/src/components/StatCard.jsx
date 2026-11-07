function StatCard({ label, value, icon, tone = 'blue' }) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__top">
        <span className="stat-card__icon" aria-hidden="true">
          {icon}
        </span>
        <span className="stat-card__label">{label}</span>
      </div>
      <div className="stat-card__value">{value}</div>
    </article>
  );
}

export default StatCard;
