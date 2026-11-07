import { describe, expect, it } from 'vitest';
import { ACTIONS, tasksReducer } from '../src/context/tasksReducer.js';

const firstTask = {
  id: 'task-1',
  text: 'Изучить Context API',
  done: false,
};

const secondTask = {
  id: 'task-2',
  text: 'Разобраться с memo',
  done: false,
};

describe('tasksReducer', () => {
  it('добавляет новую задачу в начало списка', () => {
    const initial = [firstTask];
    const result = tasksReducer(initial, {
      type: ACTIONS.ADD,
      payload: secondTask,
    });

    expect(result).toEqual([secondTask, firstTask]);
    expect(result).not.toBe(initial);
  });

  it('переключает done только у выбранной задачи', () => {
    const initial = [firstTask, secondTask];
    const result = tasksReducer(initial, {
      type: ACTIONS.TOGGLE,
      payload: 'task-1',
    });

    expect(result[0]).toEqual({ ...firstTask, done: true });
    expect(result[1]).toBe(secondTask);
    expect(initial[0].done).toBe(false);
  });

  it('удаляет задачу по id', () => {
    const result = tasksReducer([firstTask, secondTask], {
      type: ACTIONS.DELETE,
      payload: 'task-1',
    });

    expect(result).toEqual([secondTask]);
  });

  it('редактирует текст задачи иммутабельно', () => {
    const result = tasksReducer([firstTask, secondTask], {
      type: ACTIONS.EDIT,
      payload: { id: 'task-2', text: 'Повторить React.memo' },
    });

    expect(result[0]).toBe(firstTask);
    expect(result[1].text).toBe('Повторить React.memo');
    expect(secondTask.text).toBe('Разобраться с memo');
  });

  it('очищает только выполненные задачи', () => {
    const result = tasksReducer(
      [{ ...firstTask, done: true }, secondTask],
      { type: ACTIONS.CLEAR_COMPLETED },
    );

    expect(result).toEqual([secondTask]);
  });

  it('восстанавливает массив через HYDRATE', () => {
    expect(tasksReducer([], {
      type: ACTIONS.HYDRATE,
      payload: [firstTask],
    })).toEqual([firstTask]);

    expect(tasksReducer([], {
      type: ACTIONS.HYDRATE,
      payload: null,
    })).toEqual([]);
  });

  it('выбрасывает ошибку для неизвестного действия', () => {
    expect(() => tasksReducer([], { type: 'UNKNOWN' })).toThrow(
      'Unknown action: UNKNOWN',
    );
  });
});
