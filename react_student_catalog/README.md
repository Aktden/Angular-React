# Каталог студентов

Учебное приложение на **React + Vite** по материалам занятия о JSX, компонентах и пропсах.

## Возможности

- Каталог из четырёх студентов с карточками.
- Статистика: количество студентов, средний балл, минимальный возраст и число городов.
- Поиск по имени, городу и навыкам.
- Сортировка по имени, возрасту, курсу и среднему баллу.
- Аватары с резервным отображением инициалов.
- Отдельные переиспользуемые компоненты: `Header`, `Footer`, `StudentCard`, `StudentList`, `StatCard`, `Badge`, `SkillsList`.
- Условный бейдж «Отличник» для студентов со средним баллом от 4.5.
- Адаптивная вёрстка для мобильных устройств и больших экранов.

## Требования

- Node.js 18 или новее
- npm

## Запуск локально

```bash
npm install
npm run dev
```

Открой адрес, который Vite выведет в терминале (обычно `http://localhost:5173`).

## Проверка production-сборки

```bash
npm run build
npm run preview
```

Готовая сборка появится в папке `dist/`.

## Структура проекта

```text
react-student-catalog/
├── public/
├── src/
│   ├── components/
│   │   ├── Badge.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── SkillsList.jsx
│   │   ├── StatCard.jsx
│   │   ├── StudentCard.jsx
│   │   └── StudentList.jsx
│   ├── data/
│   │   └── students.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## Загрузка в GitHub

После распаковки архива открой терминал в папке проекта:

```bash
git init
git add .
git commit -m "Initial React student catalog"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

Замени `USERNAME/REPOSITORY` на адрес своего GitHub-репозитория.

## Примечание

Аватары загружаются с `ui-avatars.com`. Если сервис недоступен, карточка показывает инициалы студента. Для запуска приложения дополнительные библиотеки, кроме React и Vite, не требуются.
