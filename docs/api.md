# API & Error Codes

## Response contract
- Success: `{ "success": true, "data": <payload> }`
- Error: `{ "success": false, "error": { "code": "<ERROR_CODE>", "message": "<optional message>" } }`

Error codes map to i18n keys in `src/utils/errorCodes.ts` and `src/i18n/locales/*/common.json`.

## Endpoints

### Projects
- **GET** `/api/projects` — list projects, optional query: `category`, `search`; errors: `PROJECT.LIST_FAILED`.
- **POST** `/api/projects` — create project; body: `title`, `description`, `content?`, `repositoryUrl?`, `demoUrl?`, `categoryId?`, `authorId`, `tags?`, `images?`, `eventId?`, `attachments?`; errors: `COMMON.VALIDATION_ERROR`, `PROJECT.CREATE_FAILED`.
- **GET** `/api/projects/:id` — fetch single project; errors: `PROJECT.NOT_FOUND`, `PROJECT.LIST_FAILED`.
- **PUT** `/api/projects/:id` — update editable fields; errors: `COMMON.VALIDATION_ERROR`, `PROJECT.UPDATE_FAILED`.
- **DELETE** `/api/projects/:id` — delete project; errors: `PROJECT.DELETE_FAILED`.
- **POST** `/api/projects/:id/like` — increment likes; errors: `PROJECT.UPDATE_FAILED`.
- **POST** `/api/projects/:id/view` — increment views; errors: `PROJECT.UPDATE_FAILED`.

### Ideas
- **GET** `/api/ideas` — list ideas; errors: `IDEA.LIST_FAILED`.
- **POST** `/api/ideas` — create idea; body: `title`, `summary?`, `description?`, `tags?`, `images?`, `location?`, `authorName?`; errors: `COMMON.VALIDATION_ERROR`, `IDEA.CREATE_FAILED`.
- **GET** `/api/ideas/:id` — fetch single idea; errors: `IDEA.NOT_FOUND`, `IDEA.LIST_FAILED`.
- **POST** `/api/ideas/:id/like` — increment likes; errors: `IDEA.CREATE_FAILED`.
- **POST** `/api/ideas/:id/view` — increment views; errors: `IDEA.CREATE_FAILED`.

### Events
- **GET** `/api/events` — list events; errors: `EVENT.LIST_FAILED`.
- **POST** `/api/events` — create event; body: `title`, `subtitle?`, `summary?`, `description?`, `location?`, `startAt`, `endAt`, `registerLink?`, `registerDeadline?`, `capacity?`, `bannerUrl?`, `galleryUrls?`, `attachments?`, `status?`; errors: `COMMON.VALIDATION_ERROR`, `EVENT.CREATE_FAILED`.
- **POST** `/api/events/:id/like` — increment likes; errors: `EVENT.UPDATE_FAILED`.
- **POST** `/api/events/:id/view` — increment views; errors: `EVENT.UPDATE_FAILED`.

## Error codes → i18n keys
| Code | i18n key |
| --- | --- |
| `COMMON.UNKNOWN` | `error.common.unknown` |
| `COMMON.BAD_REQUEST` / `COMMON.VALIDATION_ERROR` | `error.common.validation` |
| `PROJECT.LIST_FAILED` | `error.project.loadFailed` |
| `PROJECT.CREATE_FAILED` / `PROJECT.UPDATE_FAILED` / `PROJECT.DELETE_FAILED` | `error.project.createFailed` / `error.project.updateFailed` / `error.project.deleteFailed` |
| `PROJECT.NOT_FOUND` | `error.project.notFound` |
| `PROJECT.MISSING_AUTHOR` | `error.project.missingUser` |
| `IDEA.LIST_FAILED` | `error.idea.loadFailed` |
| `IDEA.CREATE_FAILED` | `error.idea.createFailed` |
| `IDEA.NOT_FOUND` | `error.idea.notFound` |
| `EVENT.LIST_FAILED` | `error.event.loadFailed` |
| `EVENT.CREATE_FAILED` / `EVENT.UPDATE_FAILED` / `EVENT.DELETE_FAILED` | `error.event.createFailed` / `error.event.updateFailed` / `error.event.deleteFailed` |
| `EVENT.NOT_FOUND` | `error.event.notFound` |
