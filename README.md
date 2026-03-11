# NestJS Homework Project

Бэкенд-приложение, разработанное с использованием **NestJS**, включает в себя аутентификацию, управление сессиями, потоки одноразовых паролей (OTP), ограничение скорости запросов и управление доступом на основе ролей.

---

## Tech Stack

| Layer          | Technology              |
| -------------- | ----------------------- |
| Framework      | NestJS                  |
| Database       | PostgreSQL + Prisma ORM |
| Cache          | Redis                   |
| Object Storage | MinIO (S3-compatible)   |
| Queue          | Bull                    |
| Infrastructure | Docker Compose          |

---

## Project Structure

```
src/
├── common/       # NestJS-зависимые сущности: decorators (param / method), filters,
│                 # guards, interceptors, middlewares, pipes, exceptions, strategies
├── config/       # ENV-валидация через Zod, конфиг-модуль приложения
├── shared/       # NestJS-независимые сущности: глобальные enums, interfaces, extensions
├── infra/        # Инфраструктура: Redis, Prisma, S3 (MinIO)
├── core/         # Ядро приложения: переиспользуемые модули, hash service, otp service,
│                 # repositories, session service, throttler service, global logger middleware,
│                 # cron service, event service, files service, queue service
└── feat/         # Доменные сущности (фичи): auth, account, avatar, balance, user
```

---

## Features

### Auth & Security

- JWT-аутентификация через `@Protected` декоратор (Jwt стратегия + Role Guard)
- Refresh токен — хранится в сессии и в куки
- Хэширование паролей через **argon2** + hash pepper
- Soft-delete пользователей

### OTP & Rate Limiting

- OTP коды с кулдауном, лимитом попыток и TTL — хранятся в **Redis**
- Глобальный **Throttler** (rate limiter)

### File Storage (S3 / MinIO)

- Хранение аватарок пользователей в **MinIO** (S3-compatible)
- Загрузка через буфер и через стримы
- Валидация типа и размера файла через кастомные **Pipes** и **Interceptors**
- Soft-delete аватарок

### Users

- Пагинация и фильтрация по логину при получении списка пользователей
- Кэширование ответа в **Redis** в виде бинарных данных
- Инвалидация кэша через **EventEmitter**
- Поиск наиболее активных пользователей по нескольким условиям с использованием индексов и поиском эффективных подходов через EXPLAIN и EXPLAIN ANALIZE

### Balance & Transactions

- Пополнение, вывод и перевод депозитов между пользователями
- Транзакции выполняются через сущность `Transaction` — позволяет восстановить историю балансов
- Идемпотентность операций
- Пессимистичные блокировки для предотвращения гонок
- Предотвращение дедлоков за счёт фиксированного порядка блокировок
- Учёт уровней изоляции и транзакционных аномалий

### Scheduled Jobs

- Крон-задача на сброс балансов всех пользователей раз в 10 минут
- Реализована через очередь **Bull**

### Developer Experience

- ENV-валидация через **Zod**
- Глобальный фильтр ошибок инфраструктуры (Prisma / Redis)
- Глобальный логгер входящих запросов (middleware) + логгирование времени ответов
- DTO-валидация через Pipes
- `@Id` декоратор — быстрое получение ID текущего пользователя
- `@RefreshToken` декоратор — быстрое получение refresh-токена текущего пользователя
- `@IdempotencyKey` декоратор — быстрое получение и валидация ключа идемпотентности
- Pre-commit хуки через **Husky**
- Swagger-документация доступна по адресу `/docs`

### Tests

- Юнит-тесты для модулей `auth` и `account`

---

## Getting Started

### 1. Установить зависимости

```bash
yarn install
```

### 2. Поднять Docker-контейнеры и создать БД

```bash
yarn run docker:up
```

### 3. Заполнить БД

```bash
yarn run prisma db push
yarn run prisma:seed
```

> Для сброса хранилища postgres — выполнить `docker:down` и повторить шаги 2–3

```bash
yarn run docker:down
```

### 4. Запустить приложение

```bash
yarn start:dev
```

---

## Default Credentials

После сидирования доступны следующие аккаунты:

| Role  | Login                      | Password   |
| ----- | -------------------------- | ---------- |
| Admin | `Admin12`                  | `ADMIN12#` |
| User  | зарегистрироваться вручную | —          |

> Войдите под админом для доступа ко всем защищённым роутам, либо зарегистрируйтесь как обычный пользователь.

---

## API Docs

Swagger-документация доступна после запуска по адресу:

```
http://localhost:{PORT}/docs
```
