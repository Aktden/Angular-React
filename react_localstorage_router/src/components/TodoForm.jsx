import { useState } from 'react';

export default function TodoForm({ onAdd }) {
  const [text, setText] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText) return;

    onAdd(trimmedText);
    setText('');
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="new-todo">Новая задача</label>
      <input
        id="new-todo"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Например, повторить useEffect"
        maxLength={140}
        autoComplete="off"
      />
      <button className="button button-primary" type="submit" disabled={!text.trim()}>
        Добавить задачу
      </button>
    </form>
  );
}
