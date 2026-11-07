function ProgressBar({ done, total }) {
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <section className="progress-card" aria-label="Прогресс выполнения задач">
      <div className="progress-card__top">
        <div>
          <span className="eyebrow">Прогресс</span>
          <p className="progress-card__value">
            {done} <span>/ {total} задач</span>
          </p>
        </div>
        <strong className="progress-card__percent">{percent}%</strong>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Выполнено задач"
      >
        <div className="progress-track__fill" style={{ width: `${percent}%` }} />
      </div>
    </section>
  );
}

export default ProgressBar;
