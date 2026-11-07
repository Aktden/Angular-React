export const ACTIONS = Object.freeze({
  ADD: 'ADD',
  TOGGLE: 'TOGGLE',
  DELETE: 'DELETE',
  EDIT: 'EDIT',
  CLEAR_COMPLETED: 'CLEAR_COMPLETED',
  HYDRATE: 'HYDRATE',
});

export function tasksReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD:
      return [action.payload, ...state];

    case ACTIONS.TOGGLE:
      return state.map((task) =>
        task.id === action.payload
          ? { ...task, done: !task.done }
          : task,
      );

    case ACTIONS.DELETE:
      return state.filter((task) => task.id !== action.payload);

    case ACTIONS.EDIT:
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, text: action.payload.text }
          : task,
      );

    case ACTIONS.CLEAR_COMPLETED:
      return state.filter((task) => !task.done);

    case ACTIONS.HYDRATE:
      return Array.isArray(action.payload) ? action.payload : [];

    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}
