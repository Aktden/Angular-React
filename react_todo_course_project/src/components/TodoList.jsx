import TodoItem from './TodoItem';

function TodoList({ todos, onToggle, onDelete, onEdit, hasAnyTodos, hasActiveFilters }) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon" aria-hidden="true">
          {hasAnyTodos && hasActiveFilters ? '⌕' : '✓'}
        </div>
        <h3>{hasAnyTodos && hasActiveFilters ? 'Ничего не найдено' : 'Пока здесь пусто'}</h3>
        <p>
          {hasAnyTodos && hasActiveFilters
            ? 'Измени поисковый запрос или параметры фильтрации.'
            : 'Добавь первую задачу — и она появится в этом списке.'}
        </p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}

export default TodoList;
