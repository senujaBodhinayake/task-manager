# Task Manager

A full-stack task management system built with Next.js 15, TypeScript, MongoDB Atlas, and JWT authentication.

## Live Demo
[https://task-manager-rust-phi.vercel.app](https://task-manager-rust-phi.vercel.app)

## Tech Stack
- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes (serverless)
- **Database:** MongoDB Atlas via Mongoose ODM
- **Auth:** JWT — access token in memory, refresh token in HttpOnly cookie
- **Rate Limiting:** Upstash Redis (@upstash/ratelimit)
- **Validation:** Zod (client + server)
- **CI/CD:** GitHub Actions — lint, build, Docker
- **Deployment:** Vercel + Docker

## Features
- User registration and login with JWT authentication
- Access token in memory, refresh token in HttpOnly cookie
- Full task CRUD (Create, Read, Update, Delete)
- Kanban-style dashboard (To Do / In Progress / Done)
- Route protection — users can only access their own tasks
- Rate limiting on all auth endpoints (10 req / 60s per IP)
- Loading skeletons and error states
- Dockerized with multi-stage build
- GitHub Actions CI — lint, TypeScript check, build, Docker build

## Security
- Passwords hashed with bcryptjs (cost factor 12)
- JWT access token in React state only — never localStorage
- Refresh token in HttpOnly, Secure, SameSite=Strict cookie
- Rate limiting via Upstash Redis sliding window
- Zod input validation on client and server
- Mongoose parameterized queries — no NoSQL injection
- No stack traces exposed in production

## Local Setup

### Prerequisites
- Node.js v20+
- MongoDB Atlas account
- Upstash account

### Installation

1. Clone the repository
```bash
git clone https://github.com/senujaBodhinayake/task-manager.git
cd task-manager
```

2. Install dependencies
```bash
npm install
```

3. Copy environment file
```bash
cp .env.example .env.local
```

4. Fill in your `.env.local` values (see Environment Variables below)

5. Run the dev server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL (https://...) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token |

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login — returns access token |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Clear refresh token cookie |

### Tasks (all protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks for logged in user |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task (owner only) |
| DELETE | `/api/tasks/:id` | Delete a task (owner only) |

## Docker

```bash
# Run with Docker Compose
docker compose up --build
```

## CI/CD Pipeline
- **Lint & Type Check** — ESLint + tsc on every push
- **Build** — Next.js production build
- **Docker Build** — multi-stage image build with layer caching
