function Header() {
  return (
    <header className="hero">
      <div className="hero__content">
        <span className="eyebrow">Учебный проект · React</span>
        <h1>Каталог студентов</h1>
        <p>
          Небольшое приложение для работы с компонентами, пропсами и списками
          данных.
        </p>
      </div>

      <div className="hero__decoration" aria-hidden="true">
        <span className="hero__decoration-icon">✦</span>
        <span className="hero__decoration-orbit" />
      </div>
    </header>
  );
}

export default Header;
