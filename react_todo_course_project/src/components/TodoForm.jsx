import { useState } from 'react';

function TodoForm({ onAdd }) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');

  function handleSubmit(event) {
    event.preventDefault();

    const trimmed = text.trim();
    if (!trimmed) return;

    onAdd({ text: trimmed, priority });
    setText('');
    setPriority('medium');
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="new-todo">
        Название новой задачи
      </label>
      <input
        id="new-todo"
        className="field todo-form__input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Например, подготовить проект…"
        maxLength={160}
        required
      />

      <label className="sr-only" htmlFor="new-priority">
        Приоритет задачи
      </label>
      <select
        id="new-priority"
        className="field todo-form__priority"
        value={priority}
        onChange={(event) => setPriority(event.target.value)}
      >
        <option value="low">Низкий</option>
        <option value="medium">Средний</option>
        <option value="high">Высокий</option>
      </select>

      <button className="button button--primary" type="submit">
        <span aria-hidden="true">＋</span>
        Добавить
      </button>
    </form>
  );
}

export default TodoForm;
