# 🚀 Комплексная задача: Каталог постов (React Hook Form + Zod + TanStack Query)

Готовое приложение для запуска в **VS Code**.

## 🛠️ Как запустить

1. Открой папку проекта в VS Code.
2. Открой терминал (`Ctrl + ~` или `Terminal -> New Terminal`).
3. Установи зависимости:
   ```bash
   npm install
   ```
4. Запусти сервер разработки:
   ```bash
   npm run dev
   ```
5. Перейди по ссылке из терминала (обычно `http://localhost:5173`).

---

## 📂 Архитектура проекта
- `src/api/posts.js` — все запросы к API JSONPlaceholder (`getPosts`, `getPost`, `createPost`, `updatePost`, `deletePost`).
- `src/schemas/postSchema.js` — декларативная схема валидации Zod (наименования, текст, ID, статус, дата публикации с проверкой через `.refine()`, массив тегов).
- `src/components/PostForm.jsx` — универсальная форма для создания и редактирования с поддержкой `useFieldArray` и обработки ошибок сервера через `setError`.
- `src/pages/` — экраны приложения:
  - `PostsPage.jsx` — список постов, `useQuery`, оптимистичное удаление.
  - `NewPostPage.jsx` — создание поста.
  - `EditPostPage.jsx` — редактирование с предзагрузкой `defaultValues`.
  - `PostDetailPage.jsx` — детальная страница поста с `['posts', id]`.
