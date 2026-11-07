import { createContext, useEffect, useReducer } from 'react';
import { tasksReducer } from './tasksReducer.js';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);

const STORAGE_KEY = 'tasks-context:v1';

function readInitialTasks() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((task) =>
      task
      && typeof task.id === 'string'
      && typeof task.text === 'string'
      && typeof task.done === 'boolean',
    );
  } catch {
    return [];
  }
}

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, undefined, readInitialTasks);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.warn('Не удалось сохранить задачи в localStorage', error);
    }
  }, [tasks]);

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}
