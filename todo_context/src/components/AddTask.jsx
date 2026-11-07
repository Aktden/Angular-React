import { useState } from 'react';
import { ACTIONS } from '../context/tasksReducer.js';
import { useTasksDispatch } from '../hooks/useTasks.js';

function createTaskId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function AddTask() {
  const dispatch = useTasksDispatch();
  const [text, setText] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedText = text.trim();
    if (!trimmedText) return;

    dispatch({
      type: ACTIONS.ADD,
      payload: {
        id: createTaskId(),
        text: trimmedText,
        done: false,
        createdAt: new Date().toISOString(),
      },
    });

    setText('');
  }

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <span className="add-task-icon" aria-hidden="true">＋</span>
      <label className="visually-hidden" htmlFor="new-task">Новая задача</label>
      <input
        id="new-task"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Что важно сделать?"
        maxLength={180}
        autoComplete="off"
      />
      <button className="add-task-button" type="submit" disabled={!text.trim()}>
        Добавить <span aria-hidden="true">↗</span>
      </button>
    </form>
  );
}

export default AddTask;
