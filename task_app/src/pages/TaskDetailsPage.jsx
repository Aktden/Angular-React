import { Link, useParams, useNavigate } from 'react-router-dom';

function TaskDetailsPage({ tasks, onToggle }) {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const task = tasks.find((t) => String(t.id) === taskId);

  if (!task) {
    return (
      <div>
        <h1>Задача не найдена</h1>
        <Link to="/tasks">Назад к списку</Link>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        ← Назад
      </button>

      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <p>Статус: {task.done ? 'Выполнена' : 'В работе'}</p>
      <p>Дата: {task.createdAt}</p>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button onClick={() => onToggle(task.id)}>
          {task.done ? 'Вернуть в работу' : 'Отметить выполненной'}
        </button>
        <button onClick={() => navigate('/tasks')} style={{ color: '#ef4444' }}>
          Удалить
        </button>
      </div>
    </div>
  );
}

export default TaskDetailsPage;
