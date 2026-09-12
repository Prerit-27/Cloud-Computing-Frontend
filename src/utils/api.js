/**
 * ============================================================================
 *  API LAYER — the single place the frontend talks to Django.
 * ============================================================================
 *
 * Right now every function returns mock data. Each one is marked with a
 * `TODO(django)` comment naming the endpoint it should call, so wiring the
 * backend is a matter of deleting the mock return and uncommenting the request.
 *
 * Suggested Django setup (DRF + SimpleJWT):
 *
 *   POST   /api/auth/register/        -> { user, access, refresh }
 *   POST   /api/auth/login/           -> { user, access, refresh }
 *   POST   /api/auth/logout/
 *   GET    /api/auth/me/              -> user
 *   PATCH  /api/profile/              -> user
 *   GET    /api/workouts/?start=&end= -> [session]
 *   POST   /api/workouts/             -> session
 *   PATCH  /api/workouts/:id/         -> session
 *   DELETE /api/workouts/:id/
 *   GET    /api/stats/summary/        -> stats
 *   GET    /api/muscles/              -> [muscle]
 *
 * Set VITE_API_URL in a .env file, e.g.  VITE_API_URL=http://127.0.0.1:8000/api
 */

import {
  MOCK_USER,
  MOCK_STATS,
  MOCK_WEEKLY_VOLUME,
  MOCK_PERSONAL_BESTS,
  MOCK_ACHIEVEMENTS,
  MOCK_RECENT_ACTIVITY,
  buildMockSessions,
} from './mockData';

export const API_URL = import.meta.env?.VITE_API_URL ?? 'http://127.0.0.1:8000/api';

const TOKEN_KEY = 'fitpulse.access';
const REFRESH_KEY = 'fitpulse.refresh';

export const tokens = {
  get: () => localStorage.getItem(TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (access, refresh) => {
    if (access) localStorage.setItem(TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

/** Thin fetch wrapper — adds the JWT header and unwraps DRF error payloads. */
export async function request(path, { method = 'GET', body, ...rest } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(tokens.get() ? { Authorization: `Bearer ${tokens.get()}` } : {}),
      ...rest.headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...rest,
  });

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      // DRF returns either { detail: "..." } or { field: ["..."] }
      detail =
        data.detail ??
        Object.entries(data)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join('\n') ??
        detail;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(detail);
  }

  return res.status === 204 ? null : res.json();
}

/* Simulates network latency so loading states are visible while mocking. */
const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

/* ========================================================================== */
/* AUTH                                                                        */
/* ========================================================================== */

export async function register(payload) {
  // TODO(django): return request('/auth/register/', { method: 'POST', body: payload });
  await delay();
  const user = { ...MOCK_USER, email: payload.email, firstName: payload.firstName ?? MOCK_USER.firstName };
  tokens.set('mock-access-token', 'mock-refresh-token');
  return { user, access: 'mock-access-token', refresh: 'mock-refresh-token' };
}

export async function login(payload) {
  // TODO(django): return request('/auth/login/', { method: 'POST', body: payload });
  await delay();
  tokens.set('mock-access-token', 'mock-refresh-token');
  return { user: { ...MOCK_USER, email: payload.email }, access: 'mock-access-token' };
}

export async function logout() {
  // TODO(django): await request('/auth/logout/', { method: 'POST' });
  tokens.clear();
}

export async function getMe() {
  // TODO(django): return request('/auth/me/');
  await delay(150);
  return MOCK_USER;
}

export async function updateProfile(patch) {
  // TODO(django): return request('/profile/', { method: 'PATCH', body: patch });
  await delay();
  return { ...MOCK_USER, ...patch };
}

/* ========================================================================== */
/* WORKOUTS / CALENDAR                                                         */
/* ========================================================================== */

export async function getSessions({ start, end } = {}) {
  // TODO(django): return request(`/workouts/?start=${start}&end=${end}`);
  await delay(200);
  const all = buildMockSessions();
  if (!start || !end) return all;
  return all.filter((s) => s.date >= start && s.date <= end);
}

export async function createSession(session) {
  // TODO(django): return request('/workouts/', { method: 'POST', body: session });
  await delay(250);
  return { ...session, id: Date.now() };
}

export async function updateSession(id, patch) {
  // TODO(django): return request(`/workouts/${id}/`, { method: 'PATCH', body: patch });
  await delay(200);
  return { id, ...patch };
}

export async function deleteSession(id) {
  // TODO(django): return request(`/workouts/${id}/`, { method: 'DELETE' });
  await delay(200);
  return id;
}

/* ========================================================================== */
/* STATS                                                                       */
/* ========================================================================== */

export async function getStats() {
  // TODO(django): return request('/stats/summary/');
  await delay(200);
  return {
    ...MOCK_STATS,
    weeklyVolume: MOCK_WEEKLY_VOLUME,
    personalBests: MOCK_PERSONAL_BESTS,
    achievements: MOCK_ACHIEVEMENTS,
    recentActivity: MOCK_RECENT_ACTIVITY,
  };
}
