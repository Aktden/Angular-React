export default function Admin() {
  return (
    <section className="page-section">
      <div className="page-heading"><span className="eyebrow">ЗАЩИЩЁННЫЙ МАРШРУТ · /admin</span><h1>Панель администратора</h1><p>Демонстрационная страница доступна только при значении isAdmin = true.</p></div>
      <div className="panel admin-card"><span className="admin-shield">✓</span><div><h2>Доступ разрешён</h2><p>Защищённый маршрут проверил флаг isAdmin перед отображением страницы.</p></div></div>
    </section>
  );
}
