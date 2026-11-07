import { useEffect, useState } from 'react';

const PRIORITY_LABELS = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
};

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [error, setError] = useState('');

  useEffect(() => {
    setEditText(todo.text);
  }, [todo.text]);

  function handleSave(event) {
    event.preventDefault();
    const trimmed = editText.trim();

    if (!trimmed) {
      setError('Название задачи не может быть пустым.');
      return;
    }

    onEdit(todo.id, trimmed);
    setError('');
    setIsEditing(false);
  }

  function handleCancel() {
    setEditText(todo.text);
    setError('');
    setIsEditing(false);
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') handleCancel();
  }

  return (
    <li className={`todo-item todo-item--${todo.priority} ${todo.done ? 'is-done' : ''}`}>
      <input
        className="todo-item__checkbox"
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        aria-label={todo.done ? `Вернуть задачу «${todo.text}» в активные` : `Завершить задачу «${todo.text}»`}
      />

      <div className="todo-item__content">
        {isEditing ? (
          <form className="todo-item__edit" onSubmit={handleSave}>
            <input
              className="field todo-item__edit-input"
              value={editText}
              onChange={(event) => {
                setEditText(event.target.value);
                if (error) setError('');
              }}
              onKeyDown={handleKeyDown}
              autoFocus
              maxLength={160}
              aria-label="Новое название задачи"
              aria-invalid={Boolean(error)}
            />
            <button className="icon-button icon-button--save" type="submit" aria-label="Сохранить">
              ✓
            </button>
            <button className="icon-button" type="button" onClick={handleCancel} aria-label="Отменить">
              ×
            </button>
            {error && <span className="todo-item__error">{error}</span>}
          </form>
        ) : (
          <>
            <button
              className="todo-item__title"
              type="button"
              onDoubleClick={() => setIsEditing(true)}
              onClick={() => setIsEditing(true)}
              title="Нажми, чтобы редактировать"
            >
              {todo.text}
            </button>
            <div className="todo-item__meta">
              <span className={`priority-label priority-label--${todo.priority}`}>
                <span className="priority-label__dot" />
                {PRIORITY_LABELS[todo.priority]}
              </span>
              <time dateTime={new Date(todo.createdAt).toISOString()}>
                {new Date(todo.createdAt).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'short',
                })}
              </time>
            </div>
          </>
        )}
      </div>

      {!isEditing && (
        <div className="todo-item__actions">
          <button
            className="icon-button"
            type="button"
            onClick={() => setIsEditing(true)}
            aria-label={`Редактировать задачу «${todo.text}»`}
            title="Редактировать"
          >
            ✎
          </button>
          <button
            className="icon-button icon-button--danger"
            type="button"
            onClick={() => onDelete(todo.id)}
            aria-label={`Удалить задачу «${todo.text}»`}
            title="Удалить"
          >
            ×
          </button>
        </div>
      )}
    </li>
  );
}

export default TodoItem;
