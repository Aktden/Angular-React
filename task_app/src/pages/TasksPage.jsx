import { useSearchParams } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';

function TasksPage({ tasks, onAdd, onToggle, onDelete }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';

  return (
    <div>
      <h1>Список задач</h1>

      <TaskForm onAdd={onAdd} />

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setSearchParams({})}>Все</button>
        <button onClick={() => setSearchParams({ filter: 'active' })}>Активные</button>
        <button onClick={() => setSearchParams({ filter: 'done' })}>Выполненные</button>
      </div>

      {tasks.length === 0 ? (
        <p>Пусто</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default TasksPage;
