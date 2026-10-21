import { useState } from 'react';

function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    onAdd(trimmed, description);
    setTitle('');
    setDescription('');
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Название задачи..."
        style={{ padding: 8 }}
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Описание..."
        style={{ padding: 8 }}
      />
      <button type="submit" style={{ padding: '8px 16px', alignSelf: 'flex-start' }}>
        Добавить
      </button>
    </form>
  );
}

export default TaskForm;
