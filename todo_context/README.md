# Focus — Todo с Context API

Учебный проект по практической части 9 и 10 из `qwert.md`.

## Что реализовано

- `TasksContext` хранит список задач, `TasksDispatchContext` — только `dispatch`.
- `TasksProvider` управляет состоянием через `useReducer`.
- Задачи сохраняются в `localStorage` под ключом `tasks-context:v1`.
- Кастомные хуки `useTasks()` и `useTasksDispatch()` проверяют наличие Provider.
- `TaskItem` обёрнут в `React.memo`; обработчики используют `useCallback`.
- Фильтрация и сортировка мемоизированы через `useMemo`.
- Поиск использует кастомный `useDebounce`.
- `usePrevious` показывает предыдущее количество задач.
- Можно добавлять, редактировать, отмечать, удалять и фильтровать задачи.
- Есть unit-тесты reducer.

## Запуск

Требуется Node.js 18 или новее.

```bash
npm install
npm run dev
```

Открой адрес, который Vite выведет в терминале (обычно `http://localhost:5173`).

## Проверка

```bash
npm test
npm run build
```

## Структура

```text
src/
  components/
    AddTask.jsx
    StatsPanel.jsx
    TaskItem.jsx
    TaskList.jsx
    TaskToolbar.jsx
  context/
    TasksContext.jsx
    tasksReducer.js
  hooks/
    useDebounce.js
    usePrevious.js
    useTasks.js
  App.jsx
  main.jsx
  styles.css
tests/
  tasksReducer.test.js
```

## Где смотреть реализацию тем из задания

- Два контекста и Provider: `src/context/TasksContext.jsx`
- Reducer: `src/context/tasksReducer.js`
- Проверки контекста: `src/hooks/useTasks.js`
- Мемоизированная задача: `src/components/TaskItem.jsx`
- `useMemo` для фильтрации и сортировки: `src/components/TaskList.jsx`
- `useDebounce` и `usePrevious`: `src/hooks/`
- Тесты reducer: `tests/tasksReducer.test.js`

## Примечания

`dispatch`, возвращаемый `useReducer`, стабилен между рендерами. Поэтому компоненты, которые читают только `TasksDispatchContext`, не получают обновления контекста при изменении массива задач. `TaskItem` повторно рендерится при изменении собственного `task` или локального состояния редактирования.

Данные хранятся локально в браузере. Для сброса демо-данных удали ключ `tasks-context:v1` из `localStorage`.
