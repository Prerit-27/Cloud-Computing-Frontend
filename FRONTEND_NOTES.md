# FitPulse — Frontend additions

New pages and components added on top of the existing landing page, ready for a
Django backend.

## Routes

| Route | File | Notes |
|---|---|---|
| `/` | `src/pages/Home.jsx` | Landing page (unchanged except the muscle section) |
| `/login` | `src/components/Navbar/Login.jsx` | Now wired to auth + error/loading states |
| `/signup` | `src/pages/Signup.jsx` | **New** — validation, password strength, goal & experience pickers |
| `/app/dashboard` | `src/pages/Dashboard.jsx` | **New** — stats, weekly volume, upcoming sessions |
| `/app/calendar` | `src/pages/Calendar.jsx` | **New** — month grid, day panel, add/complete/delete |
| `/app/profile` | `src/pages/Profile.jsx` | **New** — 4 tabs: Overview, Personal Info, Training, Account |

`/app/*` renders inside `src/components/layout/AppLayout.jsx` (sidebar shell,
mobile drawer, user card, logout).

## Muscle body map

`src/components/MuscleGroup/BodyMap.jsx` + `src/utils/muscleData.js` replace the
old Unsplash photo with a hand-drawn SVG figure.

- Front and back views, each with its own muscle set.
- Every muscle is one left-half path mirrored around `x = 120`, so the two sides
  can never drift apart. Edit one path, both sides update.
- Hover highlights, click opens the detail panel (function, exercises, tip).
- Reused at a smaller size on Dashboard ("Muscle Coverage") and Profile
  ("Body Focus") via `showLabels={false}`.

To add a muscle: append an entry to `FRONT_MUSCLES` / `BACK_MUSCLES` and a
matching key in `MUSCLE_LIBRARY`.

## Connecting Django

Everything server-related goes through **`src/utils/api.js`**. Each function has
a `TODO(django)` comment naming the endpoint it should call and a commented-out
`request(...)` line — delete the mock return and uncomment.

```
POST   /api/auth/register/        -> { user, access, refresh }
POST   /api/auth/login/           -> { user, access, refresh }
POST   /api/auth/logout/
GET    /api/auth/me/              -> user
PATCH  /api/profile/              -> user
GET    /api/workouts/?start=&end= -> [session]
POST   /api/workouts/             -> session
PATCH  /api/workouts/:id/         -> session
DELETE /api/workouts/:id/
GET    /api/stats/summary/        -> stats
```

Set the base URL in `.env`:

```
VITE_API_URL=http://127.0.0.1:8000/api
```

JWT access/refresh tokens are stored via the `tokens` helper in `api.js` and
attached automatically by `request()`. DRF error payloads
(`{detail: ...}` and `{field: [...]}`) are unwrapped into `Error.message`.

Auth state lives in `src/context/AuthContext.jsx` (provider) and
`src/context/auth-context.js` (context + `useAuth` hook).

Once login is real, guard the app shell:

```jsx
<Route path="/app" element={<RequireAuth><AppLayout /></RequireAuth>}>
```

Mock data is all in `src/utils/mockData.js` — delete that file once the API is live.

## Session/workout shape

```js
{
  id: 1,
  date: '2026-09-12',     // plain YYYY-MM-DD, maps to a Django DateField
  title: 'Push Day A',
  type: 'push',           // push | pull | legs | upper | cardio | rest
  time: '06:30',
  duration: 65,           // minutes
  exercises: 6,
  volumeKg: 8200,
  completed: true,
}
```

## Bug fixed along the way

`src/index.css` had an unlayered `* { padding: 0 }` reset. Unlayered CSS
outranks Tailwind's `utilities` layer, so that rule was silently cancelling
**every** `p-*` / `px-*` / `py-*` class across the whole site — buttons and nav
links were rendering with no padding. The reset now lives inside `@layer base`.
The landing page will look noticeably better spaced as a result.
