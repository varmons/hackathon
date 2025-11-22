# Contributing

Thanks for your interest in improving Hackathon Showcase! This document outlines how to get set up, code with consistency, and submit changes that are easy to review.

## Quick start
1) Install dependencies: `npm install`
2) Prepare the database: `npx prisma db push && npx prisma db seed`
3) Run dev server: `npm run dev`
4) Run checks locally: `npm run lint && npm test`

## Coding standards
- Internationalization: never hard-code UI text. Add keys to all locales under `src/i18n/locales/<locale>/common.json` and consume via `useTranslations`/`getTranslations`.
- Errors: when adding API errors, map codes in `src/utils/errorCodes.ts` and add translations for all locales.
- Types: prefer typed payloads and zod schemas for validation; avoid `any`.
- Reuse: prefer shared services/hooks/utilities (`httpClient`, `eventService`, helpers) over duplicating fetch or formatting logic.
- Comments: only when necessary, in English, explaining the ¡°why¡± not the ¡°what¡±.
- Formatting: keep JSX small and cohesive; extract repeated UI into components or hooks when it improves clarity.

## Commit conventions
We follow a lightweight Conventional Commit style to keep history clear and searchable.
- Format: `type(scope): message`
- Types: `feat` (feature), `fix` (bug fix), `chore` (maintenance), `ci` (pipeline/scripts), `refactor` (non-feature refactor)
- Scope: optional, short area label such as `service`, `ui`, `api`, `usage-statistics`
- Message: English, concise sentence
- Examples:
  - `feat(ui): improve dropdown animation`
  - `fix(api): handle missing auth token`
  - `chore: update dependencies`

## Branch naming
- `type/short-description` or `type/YYYY-MM-DD`
- Examples: `feat/better-usage-statistics`, `fix/ui-button-spacing`, `chore/2025-11-22`

## Pull request checklist
- Scope is focused; describe the user-visible impact.
- New strings translated for `en`, `zh-CN`, and `ja-JP`.
- Lint and tests pass locally (`npm run lint && npm test`).
- Screenshots for UI changes when relevant.
- Database changes documented or seeded appropriately.

Thank you for contributing!
