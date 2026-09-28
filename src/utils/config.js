/**
 * ============================================================================
 *  APP CONFIG — single source of truth for everything environment-specific.
 * ============================================================================
 *
 * Every backend URL in the app flows from here, which reads VITE_API_URL from
 * .env. To point the frontend at a different backend (e.g. a deployed server),
 * change .env and restart the dev server — no code edits anywhere else.
 *
 * API_URL   — full base for fetch calls, e.g. http://127.0.0.1:8000/api
 * SERVER_ORIGIN — same URL minus any /api suffix; used to build absolute
 *             URLs for images Django returns as relative MEDIA paths.
 */

const RAW_API_URL = import.meta.env?.VITE_API_URL ?? 'http://127.0.0.1:8000/api';

/** Fetch base, guaranteed to have no trailing slash: `${API_URL}/login/`. */
export const API_URL = RAW_API_URL.replace(/\/+$/, '');

/** Backend origin (no /api), for resolving relative media/image paths. */
export const SERVER_ORIGIN = API_URL.replace(/\/api\/?$/, '');
