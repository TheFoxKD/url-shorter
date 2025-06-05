# Backend - URL Shortener API

NestJS API сервер для сервиса сокращения URL.

## Технологии

- **Framework**: NestJS + TypeScript
- **База данных**: PostgreSQL
- **ORM**: TypeORM
- **Валидация**: class-validator, class-transformer
- **Документация**: Swagger/OpenAPI
- **Тестирование**: Jest

## API Endpoints

### Основные эндпоинты

- `POST /shorten` - создание короткой ссылки
- `GET /{shortUrl}` - переадресация на оригинальный URL
- `GET /info/{shortUrl}` - информация о ссылке
- `DELETE /delete/{shortUrl}` - удаление ссылки
- `GET /analytics/{shortUrl}` - аналитика переходов

### Служебные эндпоинты

- `GET /health` - проверка состояния сервиса
- `GET /api` - Swagger документация

## Структура

```
backend/
├── src/
│   ├── entities/          # Сущности БД
│   ├── modules/           # Модули NestJS
│   ├── dto/              # Data Transfer Objects
│   ├── services/         # Бизнес-логика
│   ├── controllers/      # HTTP контроллеры
│   └── main.ts          # Точка входа
├── test/                # Тесты
├── Dockerfile          # Docker конфигурация
└── package.json       # Зависимости
```

## Запуск для разработки

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run start:dev

# Запуск тестов
npm test
```

## Переменные окружения

- `DATABASE_HOST` - хост PostgreSQL
- `DATABASE_PORT` - порт PostgreSQL
- `DATABASE_NAME` - имя базы данных
- `DATABASE_USER` - пользователь БД
- `DATABASE_PASSWORD` - пароль БД
- `PORT` - порт API сервера
