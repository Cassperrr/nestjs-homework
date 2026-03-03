# NestJS Homework Project

Бэкенд-приложение, разработанное с использованием **NestJS**, включает в себя аутентификацию, управление сессиями, потоки одноразовых паролей (OTP), ограничение скорости запросов и управление доступом на основе ролей.

---

## Tech Stack

| Layer          | Technology              |
| -------------- | ----------------------- |
| Framework      | NestJS                  |
| Database       | PostgreSQL + Prisma ORM |
| Cache          | Redis                   |
| Infrastructure | Docker Compose          |

---

## Project Structure

```
src/
├── common/       # NestJS-зависимые сущности: decorators, filters, guards, middlewares, strategies
├── config/       # ENV-валидация через Zod, конфиг-модуль приложения
├── shared/       # NestJS-независимые сущности: глобальные enums, interfaces, utils
├── infra/        # Инфраструктура: Redis, Prisma
├── core/         # Ядро приложения: переиспользуемые модули, hash service, otp service,
│                 # repositories, session service, throttler, global logger middleware
└── feat/         # Доменные сущности (фичи)
```

---

## Features

### Auth & Security

- JWT-аутентификация через `@Protected` декоратор (Jwt стратегия + Role Guard)
- Refresh токен — хранится в сессии и в куки
- Хэширование паролей через **argon2** + hash pepper
- Мягкое удаление пользователей

### OTP & Rate Limiting

- OTP коды с кулдауном, лимитом попыток и TTL — хранятся в **Redis**
- Глобальный **Throttler** (rate limiter)

### Developer Experience

- ENV-валидация через **Zod**
- Глобальный фильтр ошибок инфраструктуры (Prisma / Redis)
- Глобальный логгер входящих запросов (middleware)
- DTO-валидация через Pipes
- `@Id` декоратор — быстрое получение ID текущего пользователя
- Swagger-документация доступна по адресу `/docs`

### Users

- Пагинация и фильтрация по логину при получении списка пользователей

### Tests

- Юнит-тесты для модулей `auth` и `account` (не все, честно в лом)

---

## Getting Started

### 1. Установить зависимости

```bash
yarn install
```

### 2. Поднять Docker-контейнеры

```bash
yarn run docker:up
```

### 3. Заполнить БД

```bash
yarn run prisma:seed
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
