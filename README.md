# URL Shortener Service

Сервис для сокращения URL-адресов с REST API и веб-интерфейсом.

## Технологии

- **Backend**: NestJS + TypeScript
- **Frontend**: React + TypeScript + Tailwind CSS
- **База данных**: PostgreSQL 17
- **ORM**: TypeORM
- **Контейнеризация**: Docker + Docker Compose

## Функциональность

### Backend API

- `POST /shorten` - создание короткой ссылки
- `GET /{shortUrl}` - переадресация на оригинальный URL
- `GET /info/{shortUrl}` - получение информации о ссылке
- `DELETE /delete/{shortUrl}` - удаление короткой ссылки
- `GET /analytics/{shortUrl}` - детальная статистика переходов
- `GET /analytics/admin/global-stats` - общая статистика
- `GET /analytics/admin/recent-activity` - недавняя активность

### Frontend

- Создание коротких ссылок с кастомными алиасами
- Управление ссылками (просмотр, удаление, поиск, фильтрация)
- Детальная аналитика по каждой ссылке
- Общая аналитика всех ссылок
- Современный и отзывчивый интерфейс с Tailwind CSS
- Экспорт данных аналитики

## Быстрый старт

1. Клонируйте репозиторий:

```bash
git clone git@github.com:TheFoxKD/url-shorter.git
cd url-shorter
```

2. Запустите проект одной командой:

```bash
docker-compose up --build
```

3. Откройте в браузере:

- **Frontend**: <http://localhost:3001>
- **Backend API**: <http://localhost:3000>
- **Swagger документация**: <http://localhost:3000/api>

## Демо

### Главная страница

- Создание коротких ссылок
- Список всех созданных ссылок
- Поиск и фильтрация

### Аналитика

- Общая статистика: <http://localhost:3001/analytics>
- Детальная аналитика ссылки: <http://localhost:3001/analytics/{identifier}>

## Разработка

### Требования

- Docker и Docker Compose
- Node.js 24+ (для локальной разработки)
- PostgreSQL 17 (при локальной разработке)

### Структура проекта

```
url-shortener/
├── backend/                 # NestJS API сервер
│   ├── src/
│   │   ├── controllers/     # REST контроллеры
│   │   ├── services/        # Бизнес-логика
│   │   ├── entities/        # TypeORM сущности
│   │   ├── dto/            # Data Transfer Objects
│   │   └── modules/        # NestJS модули
│   └── Dockerfile
├── frontend/               # React приложение
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── pages/         # Страницы приложения
│   │   ├── services/      # API клиенты
│   │   ├── types/         # TypeScript типы
│   │   └── utils/         # Утилиты
│   ├── nginx.conf         # Nginx конфигурация
│   └── Dockerfile
├── docker-compose.yml     # Конфигурация сервисов
└── README.md
```

### Переменные окружения

Backend:

- `DATABASE_HOST` - хост базы данных (по умолчанию: postgres)
- `DATABASE_PORT` - порт базы данных (по умолчанию: 5432)
- `DATABASE_NAME` - имя базы данных (по умолчанию: url_shortener)
- `DATABASE_USER` - пользователь БД (по умолчанию: postgres)
- `DATABASE_PASSWORD` - пароль БД (по умолчанию: postgres)
- `PORT` - порт сервера (по умолчанию: 3000)

Frontend:

- `REACT_APP_API_URL` - URL backend API (по умолчанию: <http://localhost:3000>)

## API Документация

После запуска проекта Swagger документация будет доступна по адресу:
<http://localhost:3000/api>

### Основные эндпоинты

- **POST /shorten** - Создание короткой ссылки
- **GET /{identifier}** - Переадресация по короткой ссылке
- **GET /info/{identifier}** - Информация о ссылке
- **DELETE /delete/{identifier}** - Удаление ссылки
- **GET /analytics/{identifier}** - Аналитика ссылки
- **GET /analytics/admin/global-stats** - Общая статистика
- **GET /urls** - Список всех ссылок

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

### Backend

- Автоматическая генерация коротких кодов (6 символов)
- Поддержка пользовательских алиасов
- Система аналитики с отслеживанием IP, referrer, user-agent
- Маскировка IP-адресов для приватности
- Валидация входных данных с помощью class-validator
- Swagger документация
- Health checks для мониторинга
- Обработка reserved paths (защита от конфликтов маршрутов)

### Frontend

- Современный дизайн с Tailwind CSS v3
- Полная типизация с TypeScript
- Компонентная архитектура React
- Состояния загрузки и обработка ошибок
- Адаптивный дизайн для мобильных устройств
- Интерактивные графики аналитики
- Копирование ссылок в буфер обмена
- Поиск и фильтрация ссылок

### DevOps

- Multi-stage Docker builds для оптимизации размера
- Docker Compose для оркестрации сервисов
- Nginx для обслуживания статических файлов
- Health checks для всех сервисов
- Персистентные данные PostgreSQL

## Архитектура

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React)       │◄──►│   (NestJS)      │◄──►│ (PostgreSQL)    │
│   Port: 3001    │    │   Port: 3000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Автор

**Denis Krishtopa** - [TheFoxKD](https://github.com/TheFoxKD)

Выполнено как тестовое задание для демонстрации навыков full-stack разработки.
