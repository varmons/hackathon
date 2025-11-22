# Hackathon Showcase

A Next.js App Router project for discovering and submitting hackathon projects and ideas with full English / 简体中文 / 日本語 support.

## Features
- Multi-lingual UI powered by `next-intl` with locale-prefixed routes and a persistent language switcher.
- Typed domain layer (Prisma + SQLite) and normalized API responses with error-code → i18n key mapping.
- Reusable UI building blocks (cards, forms, uploaders, filters) plus locale-aware formatting helpers.
- Zod-based validation for APIs and forms; lightweight tests for i18n helpers and error mapping.

## Tech Stack
- Next.js 16 (App Router) + React 19
- TypeScript, Zod
- Prisma ORM (SQLite dev DB)
- Tailwind CSS utility classes
- next-intl for i18n

## Project Structure
```
.
└─ src/
   ├─ app/                # App Router pages (scoped by locale) and API routes
   ├─ components/         # UI components (cards, forms, uploaders, header/footer, switcher)
   ├─ domain/             # Prisma data access for projects, events, ideas, categories, users
   ├─ i18n/               # next-intl config and locale resources (en, zh-CN, ja-JP)
   ├─ lib/                # HTTP client and Prisma client
   ├─ types/              # Shared API/domain types
   └─ utils/              # Formatting, navigation, error code mapping helpers
```

## Getting Started
1) Install dependencies
```
npm install
```

2) Database
```
npx prisma db push
npx prisma db seed
```

3) Run locally
```
npm run dev
```
Open http://localhost:3000/en (or /zh-CN, /ja-JP).

4) Test
```
npm test
```

## Scripts
- `npm run dev` — start Next.js in dev mode
- `npm run build` — production build
- `npm start` — run built app
- `npm run lint` — lint with Next defaults
- `npm test` — run node tests (helpers/error mapping)

## Internationalization
- Supported locales: `en`, `zh-CN`, `ja-JP`.
- Resources live in `src/i18n/locales/<locale>/common.json` with semantic keys (e.g., `page.home.title`, `error.project.notFound`, `form.project.submit`).
- Locale persistence: cookie `NEXT_LOCALE` + locale-prefixed routes; switch languages via the header switcher.
- See `docs/i18n.md` for adding languages/keys and naming conventions.

## API
- API routes under `src/app/api/*` return `{ success: true, data }` or `{ success: false, error: { code, message } }`.
- Error codes map to translation keys via `src/utils/errorCodes.ts`.
- Domain data access lives in `src/domain/*` and is shared by API handlers and server components.
- Endpoint details and error tables: `docs/api.md`.

## License
MIT
