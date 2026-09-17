# Backend

Backend приложения Notes реализован на ASP.NET Core Web API (.NET 10) и использует PostgreSQL через Entity Framework Core.

## Требования

- .NET SDK 10
- PostgreSQL

## Настройка

В каталоге `backend/NotesApp.Api` создайте `.env`:

```dotenv
DATABASE_CONNECTION=Host=localhost;Port=5432;Database=notes;Username=postgres;Password=your_password
JWT_SECRET=your_long_random_secret
```

`JWT_SECRET` должен быть одинаковым при выдаче и проверке токенов.

## Запуск

```bash
cd backend/NotesApp.Api
dotnet restore
dotnet ef database update
dotnet run
```

Адреса по умолчанию:

- API: `http://localhost:5165`
- HTTPS: `https://localhost:7166`
- Swagger UI: `http://localhost:5165/swagger`

Если порт `5165` занят другим экземпляром API, остановите его перед запуском нового:

```bash
lsof -t -iTCP:5165 -sTCP:LISTEN | xargs -r kill
```

## Аутентификация

Регистрация и вход возвращают JWT:

```text
POST /api/Auth/register
POST /api/Auth/login
```

Оба endpoint возвращают access token. Refresh token устанавливается сервером
в защищённую `HttpOnly` cookie:

```json
{
  "token": "<access-token>",
  "expiresIn": 3600
}
```

Access token действует 1 час. Refresh token хранится в базе в виде SHA-256 хэша,
действует 30 дней и передаётся автоматически через cookie. Для обновления пары
токенов отправьте запрос без тела:

```text
POST /api/Auth/refresh
POST /api/Auth/logout
```

Тело запроса:

Тело запроса не требуется: cookie отправляется браузером автоматически.

При обновлении старый refresh token отзывается, поэтому каждый refresh token
можно использовать только один раз. Logout очищает cookie и отзывает токен.

Для защищённых endpoints передавайте заголовок:

```http
Authorization: Bearer <jwt>
```

В Swagger нажмите **Authorize** и вставьте только сам JWT без префикса `Bearer`.

## Notes API

Все маршруты заметок требуют JWT и работают только с заметками текущего пользователя:

```text
GET    /api/Notes
POST   /api/Notes
PUT    /api/Notes/{id}
DELETE /api/Notes/{id}
```

Пример создания заметки:

```bash
curl -X POST http://localhost:5165/api/Notes \
	-H 'Authorization: Bearer <jwt>' \
	-H 'Content-Type: application/json' \
	-d '{"title":"Моя заметка","content":"Текст заметки"}'
```

Ожидаемые статусы:

- `401` - отсутствует или недействителен JWT;
- `404` - заметка не найдена или принадлежит другому пользователю;
- `204` - заметка успешно удалена.

## Структура

```text
NotesApp.Api/
├── Controllers/   # Auth и Notes endpoints
├── Data/          # DbContext
├── DTOs/          # Запросы и ответы API
├── Migrations/    # EF Core migrations
├── Models/        # User, Note, Tag и RefreshToken
└── Services/      # JWT service
```
