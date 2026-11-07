import { memo, useCallback, useState } from 'react';
import { ACTIONS } from '../context/tasksReducer.js';
import { useTasksDispatch } from '../hooks/useTasks.js';

const TaskItem = memo(function TaskItem({ task }) {
  const dispatch = useTasksDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);

  const handleToggle = useCallback(() => {
    dispatch({ type: ACTIONS.TOGGLE, payload: task.id });
  }, [dispatch, task.id]);

  const handleDelete = useCallback(() => {
    dispatch({ type: ACTIONS.DELETE, payload: task.id });
  }, [dispatch, task.id]);

  const handleSave = useCallback((event) => {
    event.preventDefault();
    const nextText = draft.trim();

    if (nextText && nextText !== task.text) {
      dispatch({
        type: ACTIONS.EDIT,
        payload: { id: task.id, text: nextText },
      });
    }

    setIsEditing(false);
  }, [dispatch, draft, task.id, task.text]);

  const handleCancel = useCallback(() => {
    setDraft(task.text);
    setIsEditing(false);
  }, [task.text]);

  function startEditing() {
    setDraft(task.text);
    setIsEditing(true);
  }

  return (
    <li className={`task-item ${task.done ? 'is-done' : ''}`}>
      <label className="task-check-wrap">
        <input
          className="task-checkbox"
          type="checkbox"
          checked={task.done}
          onChange={handleToggle}
          aria-label={`${task.done ? 'Вернуть в активные' : 'Отметить выполненной'}: ${task.text}`}
        />
        <span className="custom-checkbox" aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <path d="m3.5 8.2 3 3 6-6.4" />
          </svg>
        </span>
      </label>

      {isEditing ? (
        <form className="task-edit-form" onSubmit={handleSave}>
          <input
            className="task-edit-input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') handleCancel();
            }}
            aria-label="Изменить текст задачи"
            autoFocus
            maxLength={180}
          />
          <button className="icon-button save-button" type="submit" aria-label="Сохранить">✓</button>
          <button className="icon-button" type="button" onClick={handleCancel} aria-label="Отмена">×</button>
        </form>
      ) : (
        <>
          <span className="task-text">{task.text}</span>
          <div className="task-actions">
            <button
              className="icon-button"
              type="button"
              onClick={startEditing}
              aria-label={`Редактировать: ${task.text}`}
              title="Редактировать"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="m13.8 3.2 3 3M4 16l3.6-.8L16 6.8a2.1 2.1 0 0 0-3-3L4.6 12.2 4 16Z" />
              </svg>
            </button>
            <button
              className="icon-button delete-button"
              type="button"
              onClick={handleDelete}
              aria-label={`Удалить: ${task.text}`}
              title="Удалить"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4.5 6h11M8 6V4h4v2m2.5 0-.7 10H6.2L5.5 6m3 3v4m3-4v4" />
              </svg>
            </button>
          </div>
        </>
      )}
    </li>
  );
});

export default TaskItem;
