import StatsPanel from './components/StatsPanel.jsx';
import AddTask from './components/AddTask.jsx';
import TaskList from './components/TaskList.jsx';

function App() {
  return (
    <main className="page-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <div className="app-container">
        <header className="topbar">
          <a className="brand" href="/" aria-label="Focus — главная">
            <span className="brand-mark" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span>focus<span className="brand-period">.</span></span>
          </a>
          <span className="course-label">REACT · PART 09 / 10</span>
        </header>

        <section className="intro">
          <div className="eyebrow"><span className="eyebrow-dot" /> ЛИЧНОЕ ПРОСТРАНСТВО</div>
          <h1>Меньше хаоса.<br /><span>Больше фокуса.</span></h1>
          <p className="intro-copy">
            Собери мысли в список и двигайся по одной задаче за раз.
          </p>
        </section>

        <StatsPanel />

        <section className="workspace" aria-label="Список задач">
          <div className="section-heading">
            <div>
              <p className="section-kicker">ТВОЙ ПЛАН</p>
              <h2>Задачи на сегодня</h2>
            </div>
            <span className="live-indicator"><span /> СИНХРОНИЗИРОВАНО</span>
          </div>

          <AddTask />
          <TaskList />
        </section>

        <footer className="footer">
          <span>Сделано с React</span>
          <span className="footer-separator">·</span>
          <span>Context API + useReducer + memoization</span>
        </footer>
      </div>
    </main>
  );
}

export default App;
