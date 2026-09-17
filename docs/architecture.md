# Архитектура

Проект разделён по ответственности, а не по типу файла.

## Frontend layers

```text
frontend/src/
├── app/         # запуск приложения, глобальные стили, router
├── pages/       # экранные композиции без инфраструктурной логики
├── widgets/     # крупные самостоятельные блоки интерфейса
├── features/    # пользовательские сценарии и их состояние
├── entities/    # доменные объекты и API сущностей
└── shared/      # переиспользуемые API, UI, hooks, types и утилиты
```

### Правила зависимостей

- `app` собирает приложение и может подключать любые frontend-слои.
- `pages` композиционно объединяют `widgets`, `features` и `entities`.
- `widgets` не должны хранить бизнес-правила, кроме UI-состояния своего блока.
- `features` отвечают за сценарии: авторизацию, фильтры и удаление заметки.
- `entities` содержат модель, API и UI конкретной сущности.
- `shared` не импортирует код из `pages`, `widgets`, `features` или `entities`.
- Новые импорты между слоями используют алиас `@/`, а не длинные относительные пути.

## Основные frontend-модули

- `pages/notes/MainNotes.tsx` — container страницы заметок.
- `widgets/notes-toolbar` — presenter поиска, фильтров и сортировки.
- `entities/note` — API, карточки, список и pagination data.
- `features/notes-filter` — состояние фильтров и debounce.
- `features/note-delete` — Zustand store и modal подтверждения удаления.
- `widgets/layout` — desktop sidebar, mobile drawer и header.
- `widgets/profile` — профильный popover и его Zustand state.
- `shared/api` — общий fetch-клиент с refresh flow.

## Auth flow

Access token хранится в `localStorage`. Refresh token не возвращается в JSON и
хранится в `HttpOnly` cookie. При `401` `shared/api/apiClient.ts` вызывает
`/api/Auth/refresh`, получает новый access token и повторяет исходный запрос.

## Backend boundaries

Backend сохраняет классическую ASP.NET Core структуру:

- `Controllers` — HTTP boundary;
- `DTOs` — публичные контракты;
- `Models` — доменная модель;
- `Data` — EF Core persistence;
- `Services` — JWT и прикладные сервисы;
- `Migrations` — версионирование PostgreSQL schema.

Связь заметок и тегов реализована через таблицу `NoteTag`.

## Проверка

```bash
npm run lint
npm run build
cd backend/NotesApp.Api && dotnet build
```
