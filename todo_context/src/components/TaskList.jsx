import { useCallback, useMemo, useState } from 'react';
import { ACTIONS } from '../context/tasksReducer.js';
import { useTasks, useTasksDispatch } from '../hooks/useTasks.js';
import { useDebounce } from '../hooks/useDebounce.js';
import TaskItem from './TaskItem.jsx';
import TaskToolbar from './TaskToolbar.jsx';

function TaskList() {
  const tasks = useTasks();
  const dispatch = useTasksDispatch();

  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const debouncedQuery = useDebounce(query, 250);

  const completedCount = useMemo(
    () => tasks.filter((task) => task.done).length,
    [tasks],
  );
  const activeCount = tasks.length - completedCount;

  const visibleTasks = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLocaleLowerCase('ru');

    let result = tasks.filter((task) => {
      const matchesFilter =
        filter === 'active' ? !task.done
          : filter === 'done' ? task.done
            : true;

      const matchesQuery = !normalizedQuery
        || task.text.toLocaleLowerCase('ru').includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });

    result = [...result].sort((first, second) => {
      const firstTime = first.createdAt ? new Date(first.createdAt).getTime() : 0;
      const secondTime = second.createdAt ? new Date(second.createdAt).getTime() : 0;
      return sort === 'newest' ? secondTime - firstTime : firstTime - secondTime;
    });

    return result;
  }, [tasks, filter, debouncedQuery, sort]);

  const handleClearCompleted = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_COMPLETED });
  }, [dispatch]);

  const isDebouncing = query !== debouncedQuery;

  return (
    <div className="task-list-section">
      <TaskToolbar
        filter={filter}
        onFilterChange={setFilter}
        query={query}
        onQueryChange={setQuery}
        sort={sort}
        onSortChange={setSort}
        activeCount={activeCount}
        completedCount={completedCount}
        onClearCompleted={handleClearCompleted}
      />

      {isDebouncing && <p className="search-hint">Обновляем результаты поиска…</p>}

      {visibleTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-illustration" aria-hidden="true">
            {tasks.length === 0 ? '✳' : '⌕'}
          </div>
          <h3>{tasks.length === 0 ? 'Пока здесь пусто' : 'Ничего не найдено'}</h3>
          <p>
            {tasks.length === 0
              ? 'Добавь первую задачу выше — и план начнёт складываться.'
              : 'Попробуй изменить запрос или выбрать другой фильтр.'}
          </p>
        </div>
      ) : (
        <ul className="task-list">
          {visibleTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
      )}

      <div className="list-summary">
        <span>{activeCount} {activeCount === 1 ? 'задача' : activeCount >= 2 && activeCount <= 4 ? 'задачи' : 'задач'} осталось</span>
        <span>{completedCount} выполнено</span>
      </div>
    </div>
  );
}

export default TaskList;
