/**
 * ============================================================================
 *  API LAYER — every call to the Django backend goes through this file.
 * ============================================================================
 *
 * Endpoints mirror /api/schema/ exactly:
 *
 *   exercises
 *     GET    /api/exercises/
 *     POST   /api/exercises/create/
 *     PATCH  /api/exercises/{id}/
 *     DELETE /api/exercises/{id}/delete/
 *
 *   user
 *     POST   /api/register/
 *     POST   /api/login/
 *     POST   /api/logout/
 *     GET    /api/profile/
 *     PATCH  /api/profile/
 *     POST   /api/profile/change-password/
 *     POST   /api/profile/upload-picture/
 *     DELETE /api/profile/delete/
 *
 *   schedule
 *     GET    /api/schedule/
 *     POST   /api/schedule/create/
 *     PUT    /api/schedule/{id}/
 *     DELETE /api/schedule/{id}/delete/
 *
 * Auth: DRF TokenAuthentication. /api/login/ and /api/register/ are expected to
 * return a token; it is stored in localStorage and sent as
 *   Authorization: Token <key>
 * on every subsequent request.
 *
 * Configure the base URL in .env:
 *   VITE_API_URL=http://127.0.0.1:8000/api
 */

export const API_URL = (import.meta.env?.VITE_API_URL ?? 'http://127.0.0.1:8000/api').replace(
  /\/$/,
  ''
);

const TOKEN_KEY = 'fitpulse.token';

export const auth = {
  getToken: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  setToken: (token) => {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* storage unavailable */
    }
  },
  clearToken: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* storage unavailable */
    }
  },
  isAuthenticated: () => !!auth.getToken(),
};

/** Raised for any non-2xx response. `fields` holds DRF per-field errors. */
export class ApiError extends Error {
  constructor(message, { status, fields } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fields = fields ?? {};
  }
}

/** Turns a DRF error body into a readable message + per-field map. */
function parseErrorBody(body, status) {
  if (!body || typeof body !== 'object') {
    return { message: `Request failed (${status})`, fields: {} };
  }
  if (typeof body.detail === 'string') {
    return { message: body.detail, fields: {} };
  }

  const fields = {};
  const parts = [];
  for (const [key, value] of Object.entries(body)) {
    const text = Array.isArray(value) ? value.join(' ') : String(value);
    parts.push(key === 'non_field_errors' ? text : `${key}: ${text}`);
    fields[key] = text;
  }
  return {
    message: parts.join('\n') || `Request failed (${status})`,
    fields,
  };
}

/**
 * Core fetch wrapper.
 *
 * @param path      endpoint path, e.g. '/exercises/'
 * @param method    HTTP verb
 * @param body      plain object (sent as JSON) or FormData (sent as-is)
 * @param authed    attach the Authorization header (default true)
 */
export async function request(path, { method = 'GET', body, authed = true, ...rest } = {}) {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const token = authed ? auth.getToken() : null;

  const headers = {
    Accept: 'application/json',
    // FormData must set its own multipart boundary — never set Content-Type here.
    ...(isFormData || body === undefined ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Token ${token}` } : {}),
    ...rest.headers,
  };

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      ...(body !== undefined ? { body: isFormData ? body : JSON.stringify(body) } : {}),
      ...rest,
    });
  } catch {
    throw new ApiError('Cannot reach the server. Is the Django dev server running?', {
      status: 0,
    });
  }

  if (res.status === 401) {
    auth.clearToken();
    throw new ApiError('Your session has expired. Please log in again.', { status: 401 });
  }

  if (!res.ok) {
    let parsed = { message: `Request failed (${res.status})`, fields: {} };
    try {
      parsed = parseErrorBody(await res.json(), res.status);
    } catch {
      /* error body was not JSON */
    }
    throw new ApiError(parsed.message, { status: res.status, fields: parsed.fields });
  }

  if (res.status === 204) return null;

  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/** DRF pagination returns {count, next, previous, results}; plain lists don't. */
export function unwrapList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  return [];
}

/* ========================================================================== */
/* AUTH / USER                                                                 */
/* ========================================================================== */

/** Pulls the token out of whatever shape the backend returns it in. */
function extractToken(payload) {
  return payload?.token ?? payload?.key ?? payload?.auth_token ?? payload?.access ?? null;
}

export async function register(payload) {
  const data = await request('/register/', { method: 'POST', body: payload, authed: false });
  const token = extractToken(data);
  if (token) auth.setToken(token);
  return data;
}

export async function login(payload) {
  const data = await request('/login/', { method: 'POST', body: payload, authed: false });
  const token = extractToken(data);
  if (token) auth.setToken(token);
  return data;
}

export async function logout() {
  try {
    await request('/logout/', { method: 'POST' });
  } catch {
    // A failed logout must never strand the user in a logged-in UI.
  } finally {
    auth.clearToken();
  }
}

export function getProfile() {
  return request('/profile/');
}

export function updateProfile(patch) {
  return request('/profile/', { method: 'PATCH', body: patch });
}

export function changePassword(payload) {
  return request('/profile/change-password/', { method: 'POST', body: payload });
}

/** @param file a File from an <input type="file"> */
export function uploadProfilePicture(file, fieldName = 'profile_picture') {
  const form = new FormData();
  form.append(fieldName, file);
  return request('/profile/upload-picture/', { method: 'POST', body: form });
}

export async function deleteAccount() {
  const result = await request('/profile/delete/', { method: 'DELETE' });
  auth.clearToken();
  return result;
}

/* ========================================================================== */
/* EXERCISES                                                                   */
/* ========================================================================== */

export async function listExercises(params = {}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== '' && v != null)
  ).toString();
  return unwrapList(await request(`/exercises/${qs ? `?${qs}` : ''}`));
}

export function createExercise(payload) {
  return request('/exercises/create/', { method: 'POST', body: payload });
}

export function updateExercise(id, patch) {
  return request(`/exercises/${id}/`, { method: 'PATCH', body: patch });
}

export function deleteExercise(id) {
  return request(`/exercises/${id}/delete/`, { method: 'DELETE' });
}

/* ========================================================================== */
/* SCHEDULE                                                                    */
/* ========================================================================== */

export async function listSchedule(params = {}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== '' && v != null)
  ).toString();
  return unwrapList(await request(`/schedule/${qs ? `?${qs}` : ''}`));
}

export function createScheduleEntry(payload) {
  return request('/schedule/create/', { method: 'POST', body: payload });
}

/** NOTE: the backend exposes PUT (full replace), not PATCH — send the whole object. */
export function updateScheduleEntry(id, payload) {
  return request(`/schedule/${id}/`, { method: 'PUT', body: payload });
}

export function deleteScheduleEntry(id) {
  return request(`/schedule/${id}/delete/`, { method: 'DELETE' });
}
