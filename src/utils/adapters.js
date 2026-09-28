/**
 * ============================================================================
 *  FIELD ADAPTERS — the ONLY file that knows the Django field names.
 * ============================================================================
 *
 * Components never touch raw API fields; they call the helpers below. Field
 * names here match the backend serializers exactly:
 *
 *   UserSerializer      (login/register)  id, username, email, date_joined
 *   ProfileSerializer   (/profile/)       username (read-only), email,
 *                                         first_name, last_name, bio,
 *                                         phone_number, profile_picture_url,
 *                                         updated_at
 *   ExerciseSerializer                    id, name, category, muscle_group,
 *                                         description, created_by,
 *                                         created_at, updated_at
 *   WorkoutScheduleSerializer             id, day_of_week, exercises (read),
 *                                         exercise_ids (write), muscle_groups,
 *                                         notes, created_at, updated_at
 */

/* ========================================================================== */
/* USER / PROFILE                                                             */
/* ========================================================================== */

export const userFields = {
  id: (u) => u?.id,
  username: (u) => u?.username ?? '',
  email: (u) => u?.email ?? '',
  firstName: (u) => u?.first_name ?? '',
  lastName: (u) => u?.last_name ?? '',
  bio: (u) => u?.bio ?? '',
  phone: (u) => u?.phone_number ?? '',
  avatar: (u) => u?.profile_picture_url || null,
  dateJoined: (u) => u?.date_joined,
};

export function displayName(u) {
  const full = `${userFields.firstName(u)} ${userFields.lastName(u)}`.trim();
  return full || userFields.username(u) || 'Athlete';
}

export function initialsOf(u) {
  const f = userFields.firstName(u)?.[0] ?? '';
  const l = userFields.lastName(u)?.[0] ?? '';
  const pair = (f + l).toUpperCase();
  if (pair) return pair;
  return (userFields.username(u)?.[0] ?? 'U').toUpperCase();
}

/** Absolute URL for an image. Supabase returns absolute public URLs already. */
export function mediaUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const origin = (import.meta.env?.VITE_API_URL ?? 'http://127.0.0.1:8000/api').replace(
    /\/api\/?$/,
    ''
  );
  return `${origin}${path.startsWith('/') ? '' : '/'}${path}`;
}

/**
 * PATCH /api/profile/ body. `username` is read-only on the backend, so it is
 * never sent. Empty strings are sent so a field can be cleared.
 */
export function toApiProfile(draft) {
  const body = {};
  const map = {
    email: 'email',
    firstName: 'first_name',
    lastName: 'last_name',
    bio: 'bio',
    phone: 'phone_number',
  };
  for (const [local, remote] of Object.entries(map)) {
    if (draft[local] !== undefined) body[remote] = draft[local];
  }
  return body;
}

/** POST /api/profile/change-password/ body. */
export function toApiPasswordChange({ current, next }) {
  return { old_password: current, new_password: next };
}

/** Multipart field name expected by POST /api/profile/upload-picture/. */
export const PROFILE_PICTURE_FIELD = 'image';

/* ========================================================================== */
/* EXERCISES                                                                  */
/* ========================================================================== */

export const exerciseFields = {
  id: (e) => e?.id,
  name: (e) => e?.name || 'Untitled exercise',
  description: (e) => e?.description ?? '',
  category: (e) => e?.category ?? '',
  muscleGroup: (e) => e?.muscle_group ?? '',
  createdBy: (e) => e?.created_by ?? null,
};

/** POST /api/exercises/create/ and PATCH /api/exercises/{id}/ body. */
export function toApiExercise(form) {
  return {
    name: form.name.trim(),
    description: form.description ?? '',
    category: form.category || 'strength',
    muscle_group: form.muscleGroup ?? '',
  };
}

/** Exercise.CATEGORY_CHOICES */
export const EXERCISE_CATEGORIES = ['strength', 'cardio', 'flexibility', 'balance'];

/** Exercise.MUSCLE_GROUP_CHOICES (blank allowed) */
export const MUSCLE_GROUPS = ['chest', 'back', 'legs', 'arms', 'shoulders', 'core', 'full_body'];

export const CATEGORY_COLORS = {
  strength: '#7CFF5B',
  cardio: '#FF8A5B',
  flexibility: '#B75BFF',
  balance: '#5BE7FF',
};

export const MUSCLE_COLORS = {
  chest: '#7CFF5B',
  back: '#5BE7FF',
  shoulders: '#B75BFF',
  arms: '#FF5B8A',
  legs: '#FFB85B',
  core: '#5B7CFF',
  full_body: '#5BFFC8',
};

export function categoryColor(value) {
  return CATEGORY_COLORS[String(value).toLowerCase()] ?? '#8A8A8A';
}

export function muscleColor(value) {
  return MUSCLE_COLORS[String(value).toLowerCase()] ?? '#8A8A8A';
}

/** 'full_body' -> 'Full Body' */
export function humanize(value) {
  if (!value) return '';
  return String(value)
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ========================================================================== */
/* SCHEDULE — one plan per weekday (unique per user + day_of_week)            */
/* ========================================================================== */

/** WorkoutSchedule.DAY_CHOICES, Monday first. */
export const DAYS = [
  { value: 'mon', label: 'Monday', short: 'Mon' },
  { value: 'tue', label: 'Tuesday', short: 'Tue' },
  { value: 'wed', label: 'Wednesday', short: 'Wed' },
  { value: 'thu', label: 'Thursday', short: 'Thu' },
  { value: 'fri', label: 'Friday', short: 'Fri' },
  { value: 'sat', label: 'Saturday', short: 'Sat' },
  { value: 'sun', label: 'Sunday', short: 'Sun' },
];

const DAY_INDEX = Object.fromEntries(DAYS.map((d, i) => [d.value, i]));

export function dayLabel(code) {
  return DAYS[DAY_INDEX[code]]?.label ?? humanize(code);
}

/** Day code ('mon'…'sun') for a Date. */
export function dayCodeOf(date) {
  return DAYS[(date.getDay() + 6) % 7].value;
}

export function normalizeScheduleEntry(raw) {
  const exercises = Array.isArray(raw?.exercises) ? raw.exercises : [];
  return {
    id: raw?.id,
    day: raw?.day_of_week,
    exercises,
    exerciseIds: exercises.map((e) => e.id),
    muscleGroups: (raw?.muscle_groups ?? []).filter(Boolean),
    notes: raw?.notes ?? '',
  };
}

/** The backend orders by day code alphabetically; this sorts Mon → Sun. */
export function sortByDay(entries) {
  return [...entries].sort((a, b) => (DAY_INDEX[a.day] ?? 9) - (DAY_INDEX[b.day] ?? 9));
}

/** POST /api/schedule/create/ and PUT /api/schedule/{id}/ body (full object). */
export function toApiScheduleEntry({ day, exerciseIds, notes }) {
  return {
    day_of_week: day,
    exercise_ids: (exerciseIds ?? []).map(Number),
    notes: notes ?? '',
  };
}

export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/* ========================================================================== */
/* DERIVED STATS                                                              */
/* ========================================================================== */

/**
 * There is no stats endpoint, so the dashboard summarises the weekly plan.
 * `entries` are normalised schedule entries.
 */
export function deriveStats(entries, today = new Date()) {
  const byDay = new Map(entries.map((e) => [e.day, e]));

  const week = DAYS.map((d) => {
    const entry = byDay.get(d.value);
    return {
      day: d.short,
      code: d.value,
      entry,
      count: entry?.exercises.length ?? 0,
    };
  });

  // The next 7 days starting today, each mapped onto its weekly plan.
  const upcoming = [];
  for (let i = 0; i < 7; i += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const entry = byDay.get(dayCodeOf(date));
    if (entry && entry.exercises.length) upcoming.push({ date, entry });
  }

  const muscleGroups = new Set(entries.flatMap((e) => e.muscleGroups));

  return {
    trainingDays: week.filter((d) => d.count > 0).length,
    exercisesScheduled: week.reduce((a, d) => a + d.count, 0),
    muscleGroups: [...muscleGroups],
    today: byDay.get(dayCodeOf(today)) ?? null,
    week,
    upcoming,
  };
}
