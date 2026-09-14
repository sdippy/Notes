# Notes

Приложение для работы с личными заметками. Проект состоит из React-клиента и ASP.NET Core API с PostgreSQL.

## Возможности

- Рабочее пространство «Мои заметки».
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

## Команды

```bash
npm run dev      # Сервер разработки
npm run lint     # Проверка ESLint
npm run build    # Production-сборка и проверка TypeScript
npm run preview  # Просмотр production-сборки
```

## Маршруты

- `/` перенаправляет на `/MainNotes`.
- `/MainNotes` открывает основной экран заметок.

## Структура проекта

```text
.
├── package.json           # Зависимости и npm-скрипты
├── eslint.config.js       # Конфигурация ESLint
├── tsconfig.json          # Общая конфигурация TypeScript
├── frontend/
│   ├── src/
│   │   ├── App/            # Точка входа и глобальные стили
│   │   ├── components/     # Компоненты интерфейса
│   │   ├── pages/          # Страницы приложения
│   │   ├── router/         # Маршруты
│   │   └── types/          # Общие типы frontend
│   ├── public/             # Публичные ресурсы
│   ├── index.html          # HTML-точка входа
│   ├── vite.config.ts      # Конфигурация Vite
│   ├── tsconfig.app.json   # TypeScript-конфигурация приложения
│   └── tsconfig.node.json  # TypeScript-конфигурация Vite
├── backend/                # ASP.NET Core API и миграции PostgreSQL
└── tests/                  # Автотесты (заготовка)
```
