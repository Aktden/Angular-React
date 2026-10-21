import { Link } from 'react-router-dom';

function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 0',
        borderBottom: '1px solid #eee',
      }}
    >
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
      />
      <Link
        to={`/tasks/${task.id}`}
        style={{
          flex: 1,
          textDecoration: task.done ? 'line-through' : 'none',
          color: task.done ? '#999' : '#1e293b',
        }}
      >
        {task.title}
      </Link>
      <button
        onClick={() => onDelete(task.id)}
        style={{ background: 'none', border: 'none', color: '#ef4444' }}
      >
        ✕
      </button>
    </li>
  );
}

export default TaskItem;
