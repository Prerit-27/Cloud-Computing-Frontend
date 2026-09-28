# FitPulse frontend — wired to your Django API

Every endpoint from `/api/schema/` now has UI behind it.

## Setup

```bash
npm install
echo "VITE_API_URL=http://127.0.0.1:8000/api" > .env
npm run dev
```

`VITE_API_URL` defaults to `http://127.0.0.1:8000/api` (Django's default
`runserver` port), so the `.env` is optional locally. The backend already has
`CORS_ALLOW_ALL_ORIGINS = True`.

## Routes

| Route | Auth | Endpoints used |
|---|---|---|
| `/` | public | — (landing page) |
| `/login` | public | `POST /api/login/` |
| `/signup` | public | `POST /api/register/` |
| `/app/dashboard` | required | `GET /api/schedule/`, `GET /api/exercises/` |
| `/app/calendar` | required | all 4 `schedule` endpoints, `GET /api/exercises/` |
| `/app/exercises` | required | all 4 `exercises` endpoints |
| `/app/profile` | required | `GET`/`PATCH /api/profile/`, `change-password/`, `upload-picture/`, `delete/` |

`/app/*` is wrapped in `RequireAuth`, which shows a spinner while the stored
token is verified against `GET /api/profile/`, then redirects to `/login` if
that fails. Logging in returns you to the page you were trying to reach.

## Auth

DRF `TokenAuthentication`. `/api/login/` and `/api/register/` return
`{token, user}`; the token is stored in `localStorage` and sent as
`Authorization: Token <key>` on every request. Any `401` clears it.

- Login is by **username** (not email).
- Register accepts only `username`, `email`, `password`, `confirm_password`;
  first/last name are saved right after with `PATCH /api/profile/`.
- `user` in `AuthContext` is the login `user` merged with `GET /api/profile/`.
- Changing the password deletes the token on the backend, so the UI signs out
  and sends the user to `/login`.

## Field names: `src/utils/adapters.js`

All serializer field names live in `adapters.js` and match the backend exactly:

| Resource | Fields used |
|---|---|
| Profile | `username` (read-only), `email`, `first_name`, `last_name`, `bio`, `phone_number`, `profile_picture_url` |
| Upload picture | multipart field `image` → returns `{profile_picture_url}` |
| Change password | `old_password`, `new_password` |
| Exercise | `name`, `category` (`strength`/`cardio`/`flexibility`/`balance`), `muscle_group` (`chest`/`back`/`legs`/`arms`/`shoulders`/`core`/`full_body` or blank), `description` |
| Schedule | `day_of_week` (`mon`…`sun`), `exercise_ids` (write), `exercises` (read), `muscle_groups`, `notes` |

## Schedule = weekly plan

The backend stores one plan per weekday (unique per user + `day_of_week`), not
dated sessions. The calendar shows each weekday's plan on every matching date.
Saving a day that already has a plan uses `PUT /api/schedule/{id}/`, because
POSTing the same day again returns a 500 (unique constraint). The backend
orders by day code alphabetically, so the frontend sorts Mon → Sun.

The dashboard has no stats endpoint; `deriveStats()` summarises the weekly plan
(training days, exercises per week, muscle groups, next 7 days).

## Errors

`request()` raises `ApiError` with `.message`, `.status` and `.fields`.
DRF bodies in both shapes (`{detail: "..."}` and `{field: ["..."]}`) are
unwrapped, so `{"email": ["This field must be unique."]}` renders under the
email input on the signup form rather than as a raw blob.

A failed request never leaves the UI in a lying state: list pages show an
inline error with a Retry button, and optimistic deletes roll back if the
server rejects them.

## Bugs fixed along the way

1. **`index.css` reset killed all padding.** An unlayered `* { padding: 0 }`
   outranks Tailwind's `utilities` layer, so every `p-*`/`px-*`/`py-*` class in
   the app was being cancelled — buttons and nav links rendered with no padding.
   The reset now sits in `@layer base`. This visibly changes the landing page
   spacing (for the better).

2. **Profile cover glow blocked clicks.** The decorative blur circle overflows
   the header and was intercepting pointer events on the Edit Profile button,
   making it unclickable. Added `pointer-events-none`.

3. **Zero-height chart bars.** The weekly chart columns had no height to fill,
   so bars rendered at 0px. Added `h-full` to the flex column.
