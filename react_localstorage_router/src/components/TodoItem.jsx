export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={`todo-item${todo.done ? ' is-done' : ''}`}>
      <label className="todo-check-wrap">
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggle(todo.id)}
          aria-label={`Отметить задачу «${todo.text}» выполненной`}
        />
        <span className="custom-check" aria-hidden="true" />
      </label>
      <span className="todo-text">{todo.text}</span>
      <button
        className="icon-button delete-button"
        type="button"
        onClick={() => onDelete(todo.id)}
        aria-label={`Удалить задачу «${todo.text}»`}
        title="Удалить"
      >
        ×
      </button>
    </li>
  );
}
