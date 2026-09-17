# Notes

Приложение для работы с личными заметками. Проект состоит из React-клиента и ASP.NET Core API с PostgreSQL.

## Возможности

- Рабочее пространство «Мои заметки».
- Регистрация и вход по email и паролю.
- JWT-аутентификация и защита маршрута `/MainNotes`.
- Access token в `localStorage` и refresh token в защищённой `HttpOnly` cookie.
- Автоматическое обновление access token при `401`.
- Выход из аккаунта через меню профиля.
- Popover профиля с закрытием по клику вне компонента, клавише `Escape` и при смене URL.
- Мобильное burger-меню с drawer-анимацией и адаптивный профильный popover.
- Пагинация, shimmer-загрузка, empty/error-состояния и меню действий карточки.
- Удаление заметок с подтверждением через Zustand modal store.
- Поле поиска по заметкам с фокусом через `Ctrl + K` или `Cmd + K`.
- Элементы управления фильтрацией по тегам и сортировкой по недавним изменениям.
- Навигация через React Router.
- Иконки интерфейса из Lucide React.

## Технологии

- React 19
- TypeScript 6
- Vite 8
- Tailwind CSS 4
- React Router 7
- Lucide React
- Zustand
- ESLint

## Требования

- Node.js 20 или новее
- npm
- .NET SDK 10
- PostgreSQL

## Запуск

Установите зависимости:

```bash
npm install
```

Запустите сервер разработки с горячей перезагрузкой:

```bash
npm run dev
```

После запуска приложение доступно по адресу, который выведет Vite в терминале. Команды frontend выполняются из корневой папки проекта.

В Codespaces API не вызывается напрямую через адрес браузерного `localhost`. Vite проксирует запросы `/api` во внутренний API на `http://localhost:5165`. Поэтому frontend использует относительные адреса, например `/api/Auth/login`.

## Backend

Перейдите в `backend/NotesApp.Api`, создайте файл `.env` и укажите:

```dotenv
DATABASE_CONNECTION=Host=localhost;Port=5432;Database=notes;Username=postgres;Password=your_password
JWT_SECRET=your_long_random_secret
```

Запустите API:

```bash
cd backend/NotesApp.Api
dotnet restore
dotnet ef database update
dotnet run
```

По умолчанию API доступно на `http://localhost:5165`, а Swagger UI на `/swagger`.
Подробное описание backend находится в [backend/README.md](backend/README.md).

## Аутентификация

Публичные страницы:

- `/login` — вход в аккаунт;
- `/register` — создание аккаунта.

Защищённые страницы находятся внутри `ProtectedRoute`. Если access token отсутствует в `localStorage`, пользователь перенаправляется на `/login`.

Регистрация проверяет на frontend:

- email должен быть заполнен;
- пароль должен содержать минимум 8 символов;
- подтверждение пароля должно совпадать с паролем.

После успешного входа или регистрации API возвращает access token и устанавливает
refresh token в `HttpOnly` cookie. Frontend сохраняет только access token через
`setToken` и перенаправляет пользователя на `/MainNotes`.
При истечении access token API-клиент вызывает `/api/Auth/refresh` с cookie,
сохраняет новый access token и повторяет исходный запрос. При недействительном
refresh token пользователь возвращается на `/login`.

Меню профиля доступно авторизованному пользователю. Кнопка открывает `ProfilePopover`, а пункт выхода удаляет оба токена и возвращает пользователя на `/login`.

## Команды

```bash
npm run dev      # Сервер разработки
npm run lint     # Проверка ESLint
npm run build    # Production-сборка и проверка TypeScript
npm run preview  # Просмотр production-сборки
```

## Маршруты

- `/login` — публичная страница входа.
- `/register` — публичная страница регистрации.
- `/` перенаправляет на `/MainNotes` после проверки авторизации.
- `/MainNotes` — защищённый основной экран заметок.

Подробный ручной план проверки всех пользовательских и API-сценариев находится в [tests/README.md](tests/README.md).
Описание frontend-слоёв и правил зависимостей находится в [docs/architecture.md](docs/architecture.md).

## Структура проекта

```text
frontend/src/
├── app/                    # Точка входа, глобальные стили и роутинг
├── pages/                  # Композиция экранов приложения
├── widgets/                # Layout, toolbar и profile UI
├── features/               # Auth, filters и delete-note сценарии
├── entities/               # Доменные сущности note и tag
├── shared/                 # API, hooks, types, UI и утилиты
└── assets/                 # Изображения и статические ресурсы

backend/NotesApp.Api/
├── Controllers/            # HTTP endpoints
├── DTOs/                   # Контракты запросов и ответов
├── Data/                   # EF Core DbContext
├── Migrations/             # Миграции PostgreSQL
├── Models/                 # Доменные модели
└── Services/               # JWT и прикладные сервисы
```
