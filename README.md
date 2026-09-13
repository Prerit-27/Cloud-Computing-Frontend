# FitPulse frontend

A focused personal fitness tracker with four authenticated areas: Home, Calendar, Progress, and Profile.

## Run

```bash
npm install
npm run dev
```

Set `VITE_API_URL` when the backend is not served from the same origin. The default API base is `/api`.

## Backend contract used by the frontend

The API client in `src/utils/api.js` centralizes these authenticated endpoints:

- `POST /auth/login`
- `POST /auth/signup`
- `POST /auth/logout`
- `GET|PUT|DELETE /profile`
- `POST /profile/picture` with multipart field `picture`
- `GET|POST /schedule`
- `PUT|DELETE /schedule/:id`
- `GET|POST /progress` (`POST` uses multipart field `picture` and optional `date`)
- `DELETE /progress/:id`

Schedule records are expected to expose a date (`date`, `scheduledDate`, or `workoutDate`), a muscle (`muscle`, `muscleGroup`, or `targetMuscle`), and optional `exercises`. Progress records can expose an image URL as `url`, `imageUrl`, `picture`, or `path`. Adjust only `src/utils/api.js` or the small normalizers in `src/utils/data.js` if the backend names differ.

## Verification

```bash
npm run lint
npm run build
```
