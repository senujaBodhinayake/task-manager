# PLAN.md — Task Management System
## Phase 1: Architecture Plan

## 1. Backend Choice & Justification

**Choice: Next.js 15 API Routes (App Router)**

Next.js API Routes were selected over Express.js and NestJS for the following reasons:

- **Colocation:** Same repository as the frontend — eliminates a separate server process and reduces deployment overhead.
- **Deployment:** Deploys to Vercel as serverless functions with zero extra configuration.
- **Type Safety:** Full TypeScript end-to-end with shared types between client and server.
- **Right-sized:** Built-in middleware and route handlers keep architecture lean for a CRUD-focused project.
- **MongoDB Atlas:** Mongoose ODM integrates seamlessly with Next.js API routes for document-based task storage.

NestJS would be preferred for a larger team or microservices context. Express.js offers maximum flexibility but requires manual wiring of every concern.

---

## 2. Architecture Overview

| Layer | Technology & Responsibility |
|-------|----------------------------|
| Frontend | Next.js 15 App Router — Login, Register, Dashboard, Task CRUD. React Server Components for data fetching; Client Components for interactive UI. |
| API | Next.js Route Handlers (/app/api/...) — Auth endpoints (register, login, refresh, logout) + Task CRUD with owner-scoped authorization. |
| Auth | JWT (access token 15 min in memory, refresh token 7 days in HttpOnly cookie). bcryptjs for password hashing (cost 12). |
| Database | MongoDB Atlas (free tier) via Mongoose ODM — Users and Tasks collections with userId foreign key for ownership. |
| Rate Limiting | Upstash Redis via @upstash/ratelimit — sliding window, max 10 auth requests per 60s per IP. |
| CI/CD | GitHub Actions — lint, TypeScript check, Next.js build, Docker image build on every push to main. |
| Deployment | Vercel (frontend + API serverless functions). Docker + docker-compose for local container development. |

**Data flow:** Browser → Next.js frontend → /api route handlers → Mongoose → MongoDB Atlas

---

## 3. Security Considerations

### Client-Side
- **XSS Prevention:** All output rendered via React — no dangerouslySetInnerHTML.
- **CSRF Protection:** Refresh token cookie uses SameSite=Strict. State-changing requests require Authorization header.
- **Token Storage:** Access token in React state (memory only) — never localStorage or sessionStorage. Refresh token in HttpOnly cookie.
- **Input Validation:** Zod schemas validated on both client and server.

### Server-Side
- **Password Hashing:** bcryptjs with cost factor 12.
- **Rate Limiting:** Upstash Redis sliding window — max 10 requests per 60s per IP on all auth endpoints.
- **Authorization:** Every task endpoint verifies task.userId === req.userId from verified JWT.
- **Input Sanitization:** Mongoose parameterized queries prevent NoSQL injection. Zod strips unknown fields before DB writes.
- **Error Handling:** Generic error messages in production — no stack traces or DB details leaked.
- **Secrets Management:** All keys in environment variables. .env.example committed with placeholders only.

---

## 4. Better Tech Choices 

- **tRPC:** Instead of plain REST — end-to-end type-safe RPC with zero schema duplication in a monorepo.
- **Auth.js (NextAuth v5):** Instead of custom JWT — handles token rotation and OAuth with battle-tested security defaults.
- **NestJS:** Better choice if team grows — strong DI/module system scales across multiple developers.
- **Redis Sessions:** Alongside JWT for instant token revocation without waiting for token expiry.
- **Docker Hub:** CI pipeline is structured to support pushing images to Docker Hub as a natural next step.