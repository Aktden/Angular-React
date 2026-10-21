import { Routes, Route, NavLink, Outlet } from 'react-router-dom';
import { useLocalStorage } from './hooks/useLocalStorage';
import Home from './pages/Home';
import TasksPage from './pages/TasksPage';
import TaskDetailsPage from './pages/TaskDetailsPage';
import NotFound from './pages/NotFound';

const initialTasks = [
  { id: '1', title: 'Купить продукты', description: 'Молоко, хлеб', done: false, createdAt: '2025-02-10' },
  { id: '2', title: 'Сделать домашку по React', description: 'Роутинг и localStorage', done: true, createdAt: '2025-02-11' },
  { id: '3', title: 'Позвонить другу', description: '', done: false, createdAt: '2025-02-12' },
];

function Layout() {
  const linkStyle = ({ isActive }) => ({
    fontWeight: isActive ? 'bold' : 'normal',
    color: isActive ? '#3b82f6' : '#374151',
    textDecoration: 'none',
    padding: '8px 12px',
  });

  return (
    <div>
      <nav style={{ display: 'flex', gap: 4, padding: 12, borderBottom: '1px solid #ddd' }}>
        <NavLink to="/" style={linkStyle}>Главная</NavLink>
        <NavLink to="/tasks" style={linkStyle}>Задачи</NavLink>
      </nav>

      <main style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useLocalStorage('tasks-app:v1', initialTasks);

  function addTask(title, description) {
    const newTask = {
      id: crypto.randomUUID(),
      title,
      description,
      done: false,
      createdAt: new Date().toLocaleDateString(),
    };
    setTasks((prev) => [...prev, newTask]);
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home tasks={tasks} />} />
        <Route
          path="/tasks"
          element={
            <TasksPage
              tasks={tasks}
              onAdd={addTask}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          }
        />
        <Route
          path="/tasks/:taskId"
          element={<TaskDetailsPage tasks={tasks} onToggle={toggleTask} />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
