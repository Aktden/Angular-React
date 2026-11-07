import { useContext } from 'react';
import { TasksContext, TasksDispatchContext } from '../context/TasksContext.jsx';

export function useTasks() {
  const context = useContext(TasksContext);

  if (context === null) {
    throw new Error('useTasks must be used within TasksProvider');
  }

  return context;
}

export function useTasksDispatch() {
  const context = useContext(TasksDispatchContext);

  if (context === null) {
    throw new Error('useTasksDispatch must be used within TasksProvider');
  }

  return context;
}
