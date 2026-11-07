# HybridApp — ASP.NET Core + React + Angular

Учебный проект, в котором один сервер **ASP.NET Core Web API** обслуживает два независимых frontend-приложения:

- **React + TypeScript** — главная страница `/`;
- **Angular** — страница `/angular/`;
- **ASP.NET Core API** — маршруты `/api/*`;
- **Cookie Authentication** — общая HTTP-only cookie с `Path=/`, поэтому авторизация работает для обоих клиентов на одном домене.

Проект собран по приложенному заданию. В исходном примере были уточнены пути статических файлов: так как React собирается в `wwwroot/react`, Vite в production генерирует ссылки на ресурсы с префиксом `/react/`. Для Angular production-сборка использует `baseHref=/angular/`. Это необходимо, чтобы ресурсы обоих приложений корректно загружались после публикации.

## Стек и требования

- .NET SDK **10.0** (LTS).
- Node.js **22.12+** (ветка 22 LTS) или Node.js 24 LTS; вместе с Node устанавливается npm.
- Git.
- Для запуска через HTTPS — доверенный сертификат разработки ASP.NET Core. В проекте используется Angular 21 LTS и React 19.

Проверить установку:

```powershell
dotnet --version
node --version
npm --version
```

## Структура репозитория

```text
HybridApp/
├── ClientApp/
│   ├── react/                 # React + Vite + TypeScript
│   └── angular/               # Angular standalone application
├── Server/
│   ├── Controllers/           # API и авторизация
│   ├── Properties/            # launchSettings.json
│   ├── wwwroot/               # опубликованные frontend-файлы
│   ├── Program.cs
│   └── HybridApp.Server.csproj
├── HybridApp.sln
├── .gitignore
├── .gitattributes
└── README.md
```

## Быстрый запуск в режиме разработки

Откройте три отдельных терминала из корневой папки репозитория.

### 1. Запустить ASP.NET Core API

Один раз создайте и доверьте локальный HTTPS-сертификат:

```powershell
dotnet dev-certs https --trust
```

Затем запустите сервер:

```powershell
cd Server
dotnet restore
dotnet run
```

Сервер слушает `https://localhost:7001` и `http://localhost:5001`.

### 2. Запустить React

```powershell
cd ClientApp/react
npm install
npm run dev
```

Откройте **http://localhost:5173/**.

### 3. Запустить Angular

```powershell
cd ClientApp/angular
npm install
npm start
```

Откройте **http://localhost:4200/**.

Оба dev-сервера проксируют запросы `/api` на `https://localhost:7001`. Поэтому отдельная настройка CORS для локальной разработки не требуется.

## Демо-авторизация

В `Server/appsettings.Development.json` для локального запуска заданы демонстрационные учётные данные:

| Поле | Значение |
|---|---|
| Логин | `demo` |
| Пароль | `Demo123!` |

Одна и та же cookie `HybridApp.SharedAuth` используется React и Angular. Она имеет `HttpOnly`, `SameSite=Lax` и `Path=/`.

> **Важно:** демонстрационные учётные данные предназначены только для учебного запуска. Не используйте их в опубликованном приложении. Для production задайте собственные секреты через переменные окружения `DemoAuth__Username` и `DemoAuth__Password`, включите HTTPS и замените демонстрационную проверку пользователя на полноценное хранилище пользователей/ASP.NET Core Identity.

## API

| Метод | Маршрут | Назначение |
|---|---|---|
| `POST` | `/api/auth/login` | Вход, установка общей cookie |
| `GET` | `/api/auth/me` | Получение текущего пользователя (требует входа) |
| `POST` | `/api/auth/logout` | Выход, удаление cookie |
| `GET` | `/api/demo/message` | Защищённый пример API (требует входа) |

Пример тела запроса для входа:

```json
{
  "username": "demo",
  "password": "Demo123!",
  "rememberMe": true
}
```

## Production-сборка и публикация

Из корневой папки проекта выполните:

```powershell
dotnet publish .\Server\HybridApp.Server.csproj -c Release -o .\artifacts\publish
```

Во время `dotnet publish` MSBuild автоматически устанавливает npm-зависимости (`npm install`) и собирает frontend-приложения:

1. выполняет `npm install` и `npm run build` для React;
2. копирует React `dist` в `wwwroot/react`;
3. выполняет `npm install` и production-сборку Angular;
4. копирует Angular `dist/angular/browser` в `wwwroot/angular`.

После публикации оба клиента раздаются одним ASP.NET Core приложением. Запускайте опубликованный сервер по HTTPS. Если перед ним стоит reverse proxy, отдельно настройте forwarded headers в ASP.NET Core.

Для локального запуска опубликованной сборки с демонстрационным пользователем сначала включите Development-конфигурацию (в PowerShell):

```powershell
$env:ASPNETCORE_ENVIRONMENT = "Development"
dotnet .\artifacts\publish\HybridApp.Server.dll --urls "https://localhost:7001"
```

В production вместо этого задайте переменные окружения `DemoAuth__Username` и `DemoAuth__Password`.

Адреса после запуска:

- React: `https://localhost:7001/`
- Angular: `https://localhost:7001/angular/`
- API: `https://localhost:7001/api/`

## Как проверить общую авторизацию

В режиме разработки React (`http://localhost:5173`) и Angular (`http://localhost:4200`) работают на разных портах, но используют один hostname — `localhost`. Cookie не привязана к порту: host-only cookie с `Path=/` доступна обоим dev-серверам. Каждый frontend проксирует `/api` на один ASP.NET Core сервер.

Проверка:

1. Откройте React по `http://localhost:5173/` и войдите как `demo` / `Demo123!`.
2. Перейдите на `http://localhost:4200/` в том же браузере.
3. Angular должен автоматически увидеть ту же сессию без повторного входа. Нажмите «Проверить сессию», чтобы повторно запросить защищённый API.

После production-публикации схема остаётся такой же, но оба клиента раздаются одним ASP.NET Core приложением на одном origin: React — `/`, Angular — `/angular/`.

## Полезные команды

```powershell
# Проверить .NET-проект
cd Server
dotnet build

# Проверить React
cd ..\ClientApp\react
npm run build

# Проверить Angular
cd ..\angular
npm run build
```

## Примечания по безопасности

- Пароль в `appsettings.Development.json` — только демонстрационный.
- Cookie настроена как `HttpOnly`, `SameSite=Lax`, `Path=/`; в production используется `Secure`.
- API возвращает `401/403`, а не HTML-редирект, если запрос не авторизован.
- Для реального приложения добавьте полноценную регистрацию/хранилище пользователей, защиту от CSRF для изменяющих запросов, управление секретами и HTTPS.

## Публикация на GitHub

Создайте пустой репозиторий на GitHub, затем из корневой папки проекта выполните:

```powershell
git init
git add .
git commit -m "Initial hybrid ASP.NET Core React Angular app"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/ИМЯ_РЕПОЗИТОРИЯ.git
git push -u origin main
```

Не добавляйте в Git папки `node_modules`, `bin`, `obj`, `dist` или `artifacts` — они исключены через `.gitignore`. После первого `npm install` в каждой frontend-папке будут созданы `package-lock.json`; их рекомендуется добавить в репозиторий для фиксации версий зависимостей.
