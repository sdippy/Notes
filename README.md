# Notes

Клиентское приложение на React и TypeScript, собранное с помощью Vite. Для стилей используется Tailwind CSS v4.

## Стек

- React 19
- TypeScript 6
- Vite 8
- Tailwind CSS 4
- ESLint

## Требования

- Node.js 20 или новее
- npm

## Установка

```bash
npm install
```

## Команды

Запустить локальный сервер разработки с HMR:

```bash
npm run dev
```

Проверить проект линтером:

```bash
npm run lint
```

Собрать production-версию:

```bash
npm run build
```

Предпросмотр production-сборки:

```bash
npm run preview
```

## Структура

```text
src/
├── assets/       # Статические ресурсы
├── pages/        # Страницы приложения
├── App.tsx       # Корневой компонент
├── App.css       # Глобальные стили приложения
└── main.tsx      # Точка входа
```
