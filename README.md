# Notes

Клиентское приложение для работы с личными заметками. Проект построен на React и TypeScript, собирается Vite и использует Tailwind CSS v4 для стилизации.

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

## Запуск

Установите зависимости:

```bash
npm install
```

Запустите сервер разработки с горячей перезагрузкой:

```bash
npm run dev
```

После запуска приложение доступно по адресу, который выведет Vite в терминале. Все команды выполняются из корневой папки проекта.

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
├── backend/                # Серверная часть (заготовка)
└── tests/                  # Автотесты (заготовка)
```
