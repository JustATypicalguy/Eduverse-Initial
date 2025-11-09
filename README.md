# Eduverse

Eduverse is a modular learning platform scaffolded as a multi-part repository with a server (Express + Drizzle ORM), a client (React + Vite + Tailwind), and shared TypeScript types/schemas.

This README documents how to get the project running locally, required environment variables, common issues, and recommended next steps.

## Repository layout

- `client/` – React frontend (Vite + Tailwind)
- `server/` – Express backend (TypeScript, Drizzle ORM)
- `shared/` – Shared TypeScript schema and types used by client and server
- `migrations/` – SQL / drizzle-kit migration files
- `package.json` – repo-level scripts (development helper)

> Note: This repo contains both a root `package.json` and a `server/package.json`. See "Which package.json to use" below.

## Prerequisites

- Node.js (v18+ recommended; repository has been tested with Node 20+)
- npm (or yarn/pnpm) to install packages
- PostgreSQL for local development (or a cloud/postgres-compatible provider)

Optional (recommended): Docker for running Postgres locally.

## Required environment variables

Create a `.env` file in the project root (or copy from `.env.example`) with the following variables set:

```properties
DATABASE_URL=postgres://<user>:<password>@localhost:5432/eduverse
OPENAI_API_KEY=sk-REPLACE_ME
GOOGLE_API_KEY=REPLACE_ME
SEARCH_ENGINE_ID=REPLACE_ME
JWT_SECRET=REPLACE_ME
SESSION_SECRET=REPLACE_ME
```

Important security note: Do NOT commit `.env` or real secrets to git. Use `.env.example` (placeholders only) and add `.env` to `.gitignore`.

## Which package.json to use

- To run the server from the repository root, use the root scripts (recommended for dev convenience).
- Alternatively you can `cd server` and run `npm install` / `npm run dev` there if you prefer an isolated install.

Examples (PowerShell):

```powershell
# install deps at repo root
npm install

# run the backend (root dev script)
npm run dev

# OR run server package directly
cd server
npm install
npm run dev
```

## Database / migrations

- This project uses Drizzle ORM. Migrations (if present) are in `migrations/` and can be applied with `drizzle-kit`.
- If you use Postgres locally, ensure any required extensions are enabled (for example `pgcrypto` for `gen_random_uuid()`):

```sql
-- Run in psql or via migration
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

If you need to push migrations with drizzle-kit:

```powershell
npm run db:push
```

## Common setup steps

1. Copy or create `.env` from `.env.example` and fill placeholders.
2. Install dependencies: `npm install` (at root or in `server/` as your chosen workflow).
3. Start the dev server: `npm run dev`.

## Troubleshooting

- Error: `FATAL ERROR: DATABASE_URL is not set` — ensure your `.env` is present and the `DATABASE_URL` key is set. We load `.env` early in the server; if you still see the error check which script you used to start the server and that `dotenv` is available.
- Error: `Cannot find package '@paralleldrive/cuid2'` — run `npm install` at the package level that runs the server (root or `server/`). Ensure the dependency is present in that `package.json`.
- Path alias issues (`@shared/*`) — TypeScript `paths` are compile-time only. Dev runners like `tsx` or Vite may need additional config to resolve path aliases at runtime. If you run into module resolution errors, either use relative imports or add a runtime path resolver (e.g. `tsconfig-paths`).

## Security recommendations

- Remove real API keys and database passwords from the repository immediately and rotate them (regenerate keys, change DB passwords) if they have been pushed to a remote.
- Add `.env` and `server/.env` to `.gitignore`.
- Fail startup on missing critical secrets such as `JWT_SECRET` and `SESSION_SECRET` in production; do not rely on insecure fallback defaults.

## Developer workflow suggestions

- Standardize where you run commands from (root vs `server/`) and document it in this README.
- Consider setting up a proper monorepo workspace (npm/pnpm workspaces) if you want shared dependency management.
- Replace console.log debugging with a configurable logger (winston, pino) for production.

## Contributing

1. Fork the repo and create a feature branch.
2. Add tests or verify the app starts locally.
3. Open a pull request describing changes and motivations.

## License

MIT

---

If you want, I can:
- add a `.env.example` file with placeholders and add `.env` to `.gitignore` now;
- create a short `CONTRIBUTING.md` and a `docs/` folder for setup guides;
- or update the README to prefer running from server or root (your choice).

Tell me which optional items to add and I'll implement them.

# Eduverse

A starter/fullstack project combining a React client, an Express/TypeScript server, and a shared Drizzle schema.

This README explains how to set up, run, and develop locally and calls out important security and repo-structure notes.

## Repository layout

- `client/` — React + Vite frontend source
- `server/` — Express/TypeScript backend service (Drizzle ORM, OpenAI integration, WebSockets)
- `shared/` — Shared TypeScript code: Drizzle schema, types, and zod schemas used by both client and server
- `migrations/` — SQL migration files
- `scripts/`, `server/src/` — server code (API routes, services, db, middleware)

> Note: There are multiple `package.json` files in the repo (root and `server/`). By default the project is runnable from the repository root — see "Development" below.

## Prerequisites

- Node.js (v18+ recommended; project used Node 22 in earlier runs). Use nvm or similar if you manage multiple Node versions.
- npm (or pnpm/yarn if you prefer, but the README commands use npm)
- PostgreSQL (local or hosted). You can run one via Docker for local development.

Optional but recommended
- Docker & Docker Compose (for DB sandboxing)
- A modern IDE (VS Code) with TypeScript support

## Quick start (recommended: repository root)

1. Install dependencies at repo root:

```powershell
cd "d:\VIisual Studio Code\EduVerse\Eduverse-Initial"
npm install
```

2. Create a local `.env` file (do not commit it). Use `.env.example` (not included automatically) as a guide — below is the minimal set needed:

```properties
# .env (local, DO NOT COMMIT)
DATABASE_URL=postgres://user:password@localhost:5432/eduverse
OPENAI_API_KEY=sk-REPLACE_ME
GOOGLE_API_KEY=REPLACE_ME
SEARCH_ENGINE_ID=REPLACE_ME
JWT_SECRET=REPLACE_ME
SESSION_SECRET=REPLACE_ME
```

3. Start the dev server from repo root (the root package.json contains dev scripts that run the server in watch mode):

```powershell
npm run dev
```

If you prefer to run the server package independently (inside `server/`), you can `cd server` and run `npm install` and `npm run dev` there, but be mindful of differing `package.json` versions.

## Database (Postgres) — local Docker example

You can run a Postgres instance quickly with Docker:

```powershell
# Run Postgres locally (password: example)
docker run --name eduverse-postgres -e POSTGRES_PASSWORD=example -e POSTGRES_DB=eduverse -p 5432:5432 -d postgres:15
```

After DB is up and the `DATABASE_URL` is set in your `.env`, run any migration or setup routine (see below).

## Migrations / Drizzle

This project uses Drizzle and `drizzle-kit`. A convenience script is present in package.json:

```powershell
# push migrations (will attempt to apply schema changes)
npm run db:push
```

If your schema uses Postgres functions like `gen_random_uuid()`, ensure the necessary extensions (e.g., `pgcrypto`) are enabled on the database before running migrations.

## Environment variables (required)

- `DATABASE_URL` — full Postgres connection string (postgres://user:pass@host:port/db)
- `OPENAI_API_KEY` — (optional) API key for OpenAI features — if missing the app may run in demo mode
- `GOOGLE_API_KEY` / `SEARCH_ENGINE_ID` — used by some AI search features
- `JWT_SECRET` — required for signing auth tokens. **Do not leave a default in production.**
- `SESSION_SECRET` — required if session middleware is used

Security note: Do not commit real keys to the repository. Use a `.env` file kept out of source control and add `.env` to `.gitignore`.

## Security & Secrets

- Immediately rotate any secret that has been committed to version control (OpenAI key, DB password, etc.).
- Add `.env` and `server/.env` to `.gitignore`.
- Consider failing fast on missing critical secrets (the codebase already checks for `DATABASE_URL` at startup). For `JWT_SECRET` and `SESSION_SECRET`, avoid insecure defaults in code — prefer explicit failure or a `DEMO_MODE` guard.

## Path aliases and imports

The project uses TypeScript path aliases (see `tsconfig.json`):

- `@shared/*` -> `./shared/*`

These aliases are compile-time only. Your runtime/dev tool (e.g., `tsx`/Vite) must support them. If you see module resolution errors referencing `@shared`, either:

- Ensure your dev runner honors `tsconfig` paths (e.g., `tsx` with proper config), or
- Replace imports with relative paths (e.g., `../shared/...`) for Node runtime compatibility.

## Notes about multiple package.json files

This repo has more than one `package.json`. Decide on a consistent workflow:

- If you prefer a monorepo: convert to npm/pnpm/yarn workspaces and manage versions centrally.
- If you prefer separate packages: run `npm install` in each package you intend to run and be aware of possibly different dependency versions.

Currently, the repository root has a `dev` script that runs the server in watch mode and is the suggested entrypoint.

## Common troubleshooting

- "FATAL ERROR: DATABASE_URL is not set" — ensure `.env` is present and `DATABASE_URL` is set; dotenv must be loaded early. Start server from root (or ensure `--require dotenv/config` is used).
- Module resolution failures with `@shared/*` — check the runtime path-mapping or use relative imports.
- If migrations fail due to missing Postgres extensions, enable them with SQL (`CREATE EXTENSION IF NOT EXISTS pgcrypto;`) or adjust the schema to use available functions.

## Recommended next steps / hardening

1. Add `.env.example` with placeholders and add actual `.env` to `.gitignore`.
2. Rotate any secrets that were accidentally committed.
3. Standardize where developers run commands (root vs package) and consolidate important dependency versions (e.g., `drizzle-orm`, `tsx`, `typescript`).
4. Use a structured logging library (winston/pino) and a LOG_LEVEL env variable for production readiness.
5. Consider adding a `Makefile` or `scripts/dev.sh` that documents and automates DB startup, migrations, and dev start.

## Contributing

- Open issues for feature requests and bugs.
- Use branches for work and create PRs against `develop` or `main` as your repo workflow dictates.


