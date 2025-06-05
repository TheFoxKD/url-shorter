# URL Shortener Service

Сервис для сокращения URL-адресов с REST API и веб-интерфейсом.

## Технологии

- **Backend**: NestJS + TypeScript
- **Frontend**: React + TypeScript
- **База данных**: PostgreSQL
- **ORM**: TypeORM
- **Контейнеризация**: Docker + Docker Compose

## Функциональность

### Backend API

- `POST /shorten` - создание короткой ссылки
- `GET /{shortUrl}` - переадресация на оригинальный URL
- `GET /info/{shortUrl}` - получение информации о ссылке
- `DELETE /delete/{shortUrl}` - удаление короткой ссылки
- `GET /analytics/{shortUrl}` - статистика переходов

### Frontend

- Создание коротких ссылок
- Управление ссылками (просмотр, удаление)
- Просмотр статистики переходов
- Современный и удобный интерфейс

## Быстрый старт

1. Клонируйте репозиторий:

```bash
git clone <repository-url>
cd url-shortener
```

2. Запустите проект одной командой:

```bash
docker-compose up --build
```

3. Откройте в браузере:

- Frontend: <http://localhost:3001>
- Backend API: <http://localhost:3000>
- Swagger документация: <http://localhost:3000/api>

## Разработка

### Требования

- Docker и Docker Compose
- Node.js 18+ (для локальной разработки)

### Структура проекта

```
url-shortener/
├── backend/          # NestJS API сервер
├── frontend/         # React приложение
├── docker-compose.yml
└── README.md
```

### Переменные окружения

- `DATABASE_HOST` - хост базы данных
- `DATABASE_PORT` - порт базы данных
- `DATABASE_NAME` - имя базы данных
- `DATABASE_USER` - пользователь БД
- `DATABASE_PASSWORD` - пароль БД
- `REACT_APP_API_URL` - URL backend API

## API Документация

После запуска проекта API документация будет доступна по адресу:
<http://localhost:3000/api>

## Тестирование

```bash
# Backend тесты
cd backend
npm test

# Frontend тесты
cd frontend
npm test
```

## Особенности реализации

- Автоматическая генерация коротких ссылок
- Пользовательские алиасы для ссылок
- Отслеживание кликов с IP-адресами
- Срок действия ссылок
- Валидация входных данных
- Обработка ошибок
- Rate limiting
- Health checks

## Автор

Выполнено как тестовое задание
