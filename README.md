# FitPulse Frontend

React and Vite frontend for FitPulse, a workout planning and exercise tracking app. It includes a public landing page, authentication, and protected dashboard, calendar, exercise library, and profile pages.

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- The FitPulse Django API for login and backend-backed app features

## Setup

From the `frontend` directory:

```bash
npm install
```

The API URL defaults to `http://127.0.0.1:8000/api`. To use a different backend, copy `.env.example` to `.env` and set the API base URL (include `/api`):

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Restart Vite after changing environment variables. Ensure the backend allows requests from the frontend origin through its CORS configuration.

## Run locally

Start the Django backend, then run the frontend development server:

```bash
npm run dev
```

Vite prints the local URL (typically <http://localhost:5173>).

## Available commands

```bash
npm run dev      # Start the Vite development server
npm run build    # Create a production build in dist/
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```

## Routes and authentication

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Landing page |
| `/login` | Public | Sign in; users who tried to access a protected page return there after login |
| `/signup` | Public | Create an account |
| `/app/dashboard` | Signed in | Dashboard |
| `/app/calendar` | Signed in | Weekly workout planner |
| `/app/exercises` | Signed in | Exercise library |
| `/app/profile` | Signed in | Profile and account settings |

A saved token is verified against the profile API on app startup. Signed-out visitors are redirected to login when opening protected routes. Signed-in visitors who open login or signup are redirected to the dashboard. The landing page remains accessible while signed in.

## API configuration

`VITE_API_URL` is read in `src/utils/config.js` and is the base for API requests. Relative backend media URLs use the same host without the trailing `/api`. Public landing-page assets, including the exercise preview images, are served from `public/`.

See [`FRONTEND_NOTES.md`](./FRONTEND_NOTES.md) for endpoint and serializer details used by the frontend.
