## MovieFinder - локальная библиотека фильмов

<img width="1920" height="1080" alt="Code_ImH614dgv3" src="https://github.com/user-attachments/assets/e87c432a-6230-492e-8fd2-448ecec3e9a0" />

MovieFinder - одностраничное приложение для ведения личной коллекции фильмов. Каталог встроен в проект, поэтому поиск и работа с фильмами не зависят от внешних API и доступны без подключения к интернету.

## Технологии

- React 18 и TypeScript
- Vite
- React Router v6
- Context API для темы, избранного и статуса просмотра
- React Hook Form и Zod для валидации форм
- TanStack Query для управления локальными данными и обновления интерфейса
- localStorage для хранения библиотеки в браузере

## Возможности

- Локальный каталог стартовых фильмов
- Поиск по названию, режиссёру, жанру, году и описанию
- Фильтрация по жанру, статусу просмотра и избранному
- Сортировка по рейтингу, году и названию
- Добавление, редактирование и удаление фильмов
- Сохранение избранного и просмотренных фильмов
- Светлая и тёмная темы
- Стилизованные локальные обложки, если ссылка на постер не указана
- Адаптивный интерфейс для компьютеров, планшетов и телефонов

## Локальное хранение

Все записи хранятся в `localStorage` браузера под ключом `moviefinder_movies`. Поисковый запрос фильтрует уже загруженный локальный массив. Приложение не отправляет запросы к сторонним API и не требует API-ключа.

Если в браузере остались пользовательские записи предыдущей версии, приложение переносит добавленные фильмы и изменения в новую локальную библиотеку при первом запуске.

## Запуск

```bash
npm install
npm run dev
```

## Production-сборка

```bash
npm run build
```
## Работа программы 
<img width="1920" height="1080" alt="Code_Z4wKgoIvgl" src="https://github.com/user-attachments/assets/988978a1-077d-45c9-a9a1-084e20bb9e07" />
<img width="1920" height="1080" alt="Code_XqN9Ny8JuU" src="https://github.com/user-attachments/assets/227e7847-9e1e-4c96-96bb-284db14078fd" />
<img width="1920" height="1080" alt="Code_nBDJNLoB65" src="https://github.com/user-attachments/assets/405b6d40-f67a-43f2-a743-3d444d9c345e" />
<img width="1920" height="1080" alt="Code_ImH614dgv3" src="https://github.com/user-attachments/assets/4a328992-b004-4606-b8d8-55fe46faf35d" />
<img width="1920" height="1080" alt="Code_8EcXYmEWFg" src="https://github.com/user-attachments/assets/3ccff433-7c9d-422b-8fb7-a0ca72a7f5e0" />

