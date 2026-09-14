# FitPulse frontend — wired to your Django API

Every endpoint from `/api/schema/` now has UI behind it.

## Setup

```bash
npm install
echo "VITE_API_URL=http://127.0.0.1:8000/api" > .env
npm run dev
```

Your Django server needs `django-cors-headers` allowing the Vite origin
(`http://localhost:5173`), otherwise every request fails in the browser.

## Routes

| Route | Auth | Endpoints used |
|---|---|---|
| `/` | public | — (landing page) |
| `/login` | public | `POST /api/login/` |
| `/signup` | public | `POST /api/register/` |
| `/app/dashboard` | required | `GET /api/schedule/`, `GET /api/exercises/` |
| `/app/calendar` | required | all 4 `schedule` endpoints |
| `/app/exercises` | required | all 4 `exercises` endpoints |
| `/app/profile` | required | `GET`/`PATCH /api/profile/`, `change-password/`, `upload-picture/`, `delete/` |

`/app/*` is wrapped in `RequireAuth`, which shows a spinner while the stored
token is verified against `GET /api/profile/`, then redirects to `/login` if
that fails. Logging in returns you to the page you were trying to reach.

## Auth

DRF `TokenAuthentication`. The token from `/api/login/` or `/api/register/` is
stored in `localStorage` and sent as `Authorization: Token <key>` on every
request. Any `401` clears it and bounces to login.

`extractToken()` in `api.js` accepts `token`, `key`, `auth_token` or `access`,
so it works whichever key your serializer returns. If registration does not
return a token, the user is sent to `/login` instead of the dashboard.

## >> The one file to check: `src/utils/adapters.js` <<

I did not have your serializer fields, so **every field-name guess lives in
`src/utils/adapters.js` and nowhere else.** Components call helpers like
`exerciseFields.name(item)`; they never touch raw API keys.

Reads are forgiving — each getter tries several plausible names and returns the
first present, so a wrong guess shows an empty value instead of crashing:

```js
name: (e) => pick(e, 'name', 'title', 'exercise_name') ?? 'Untitled exercise',
```

Writes must be exact. These are the ones to verify against your schema:

- `toApiProfile()` — assumes `first_name`, `last_name`, `bio`, `location`,
  `date_of_birth`, `height`, `weight`
- `toApiPasswordChange()` — assumes `old_password`, `new_password`,
  `confirm_password`
- `toApiExercise()` — assumes `name`, `description`, `category`, `equipment`,
  `difficulty`, `sets`, `reps`
- `toApiScheduleEntry()` — assumes `title`, `date`, `time`, `duration`,
  `exercise`, `sets`, `reps`, `notes`
- `PROFILE_PICTURE_FIELD` — the multipart field name, currently
  `profile_picture`
- `EXERCISE_CATEGORIES` — placeholder values; replace with your real
  `CategoryEnum`

Paste your schema and I'll trim these to the exact names.

### Two deliberate hedges

**Schedule shape.** I could not tell whether a schedule row is date-based or
weekday-based, so the calendar handles both. `normalizeScheduleEntry()` reads
whichever is present; `expandToRange()` repeats a weekday-only row on every
matching day so a weekly template still fills the month (those render with a
"Weekly" badge). `toApiScheduleEntry()` sends **both** `date` and `day_of_week`
— delete whichever your serializer rejects.

**PUT, not PATCH.** Your schedule update is `PUT`, which replaces the whole
object, so `toApiScheduleUpdate()` spreads the original payload and overrides
only what changed. It also converts a nested `exercise` object back to its id,
since a read serializer that nests will not accept a nested write.

## No stats endpoint

There is no `/api/stats/`, so the dashboard derives its numbers client-side in
`deriveStats()` — streak, sessions completed, minutes trained, and the weekly
chart, all computed from `GET /api/schedule/`. If you add a stats endpoint
later, replace that one function.

## Errors

`request()` raises `ApiError` with `.message`, `.status` and `.fields`.
DRF bodies in both shapes (`{detail: "..."}` and `{field: ["..."]}`) are
unwrapped, so `{"email": ["This field must be unique."]}` renders under the
email input on the signup form rather than as a raw blob.

A failed request never leaves the UI in a lying state: list pages show an
inline error with a Retry button, and optimistic updates (completing a session,
deleting an exercise) roll back if the server rejects them.

## Testing without the backend

`/tmp/stub/server.py` in this session was a throwaway stand-in that implements
these exact routes. Not included here — point `VITE_API_URL` at your real
server.

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
