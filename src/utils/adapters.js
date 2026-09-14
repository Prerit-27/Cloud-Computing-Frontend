/**
 * ============================================================================
 *  FIELD ADAPTERS — the ONLY file that knows your Django field names.
 * ============================================================================
 *
 * Components never touch raw API fields; they call the helpers below. So when
 * a serializer field is named differently than guessed, you fix it HERE and
 * nowhere else.
 *
 * Every getter uses `pick()`, which tries several plausible names and returns
 * the first one present. That means a wrong guess degrades to a blank value
 * instead of crashing the page. Once you confirm the real names from
 * /api/schema/, trim each list down to the single correct field.
 *
 * `toApi*` functions build request bodies. Those DO need to be exact — a wrong
 * key there means the backend ignores or rejects the value.
 */

/** First defined, non-empty value among the given keys. */
function pick(obj, ...keys) {
  if (!obj) return undefined;
  for (const k of keys) {
    const v = obj[k];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return undefined;
}

/* ========================================================================== */
/* USER / PROFILE                                                             */
/* ========================================================================== */

export const userFields = {
  id: (u) => pick(u, 'id', 'pk'),
  username: (u) => pick(u, 'username', 'user_name') ?? '',
  email: (u) => pick(u, 'email') ?? '',
  firstName: (u) => pick(u, 'first_name', 'firstName') ?? '',
  lastName: (u) => pick(u, 'last_name', 'lastName') ?? '',
  bio: (u) => pick(u, 'bio', 'about') ?? '',
  location: (u) => pick(u, 'location', 'city') ?? '',
  avatar: (u) => pick(u, 'profile_picture', 'profile_pic', 'avatar', 'image', 'picture') ?? null,
  dateJoined: (u) => pick(u, 'date_joined', 'created_at', 'joined_at'),
  dateOfBirth: (u) => pick(u, 'date_of_birth', 'birth_date', 'dob') ?? '',
  height: (u) => pick(u, 'height', 'height_cm'),
  weight: (u) => pick(u, 'weight', 'weight_kg'),
  goal: (u) => pick(u, 'goal', 'primary_goal', 'fitness_goal') ?? '',
  experience: (u) => pick(u, 'experience', 'experience_level', 'level') ?? '',
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

/** Absolute URL for an uploaded image (Django returns a relative MEDIA path). */
export function mediaUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const origin = (import.meta.env?.VITE_API_URL ?? 'http://127.0.0.1:8000/api').replace(
    /\/api\/?$/,
    ''
  );
  return `${origin}${path.startsWith('/') ? '' : '/'}${path}`;
}

/** PATCH /api/profile/ body. Only sends keys the form actually changed. */
export function toApiProfile(draft) {
  const body = {};
  const map = {
    username: 'username',
    email: 'email',
    firstName: 'first_name',
    lastName: 'last_name',
    bio: 'bio',
    location: 'location',
    dateOfBirth: 'date_of_birth',
    height: 'height',
    weight: 'weight',
    goal: 'goal',
    experience: 'experience',
  };
  for (const [local, remote] of Object.entries(map)) {
    if (draft[local] !== undefined && draft[local] !== '') body[remote] = draft[local];
  }
  return body;
}

/** POST /api/profile/change-password/ body. */
export function toApiPasswordChange({ current, next, confirm }) {
  return {
    old_password: current,
    new_password: next,
    confirm_password: confirm,
  };
}

/** Form field name used by POST /api/profile/upload-picture/. */
export const PROFILE_PICTURE_FIELD = 'profile_picture';

/* ========================================================================== */
/* EXERCISES                                                                  */
/* ========================================================================== */

export const exerciseFields = {
  id: (e) => pick(e, 'id', 'pk'),
  name: (e) => pick(e, 'name', 'title', 'exercise_name') ?? 'Untitled exercise',
  description: (e) => pick(e, 'description', 'notes', 'instructions') ?? '',
  category: (e) => pick(e, 'category', 'muscle_group', 'type') ?? '',
  equipment: (e) => pick(e, 'equipment', 'gear') ?? '',
  difficulty: (e) => pick(e, 'difficulty', 'level') ?? '',
  sets: (e) => pick(e, 'sets', 'default_sets'),
  reps: (e) => pick(e, 'reps', 'default_reps'),
  image: (e) => mediaUrl(pick(e, 'image', 'picture', 'photo')),
};

/** POST /api/exercises/create/ and PATCH /api/exercises/{id}/ body. */
export function toApiExercise(form) {
  const body = {
    name: form.name,
    description: form.description ?? '',
  };
  if (form.category) body.category = form.category;
  if (form.equipment) body.equipment = form.equipment;
  if (form.difficulty) body.difficulty = form.difficulty;
  if (form.sets !== '' && form.sets != null) body.sets = Number(form.sets);
  if (form.reps !== '' && form.reps != null) body.reps = Number(form.reps);
  return body;
}

/**
 * Category choices. Replace with the real CategoryEnum values from
 * /api/schema/ — the labels are just prettified versions of the value.
 */
export const EXERCISE_CATEGORIES = [
  'chest',
  'back',
  'shoulders',
  'arms',
  'legs',
  'core',
  'cardio',
  'full_body',
];

export const CATEGORY_COLORS = {
  chest: '#7CFF5B',
  back: '#5BE7FF',
  shoulders: '#B75BFF',
  arms: '#FF5B8A',
  legs: '#FFB85B',
  core: '#5B7CFF',
  cardio: '#FF8A5B',
  full_body: '#5BFFC8',
};

export function categoryColor(value) {
  return CATEGORY_COLORS[String(value).toLowerCase()] ?? '#8A8A8A';
}

/** 'full_body' -> 'Full Body' */
export function humanize(value) {
  if (!value) return '';
  return String(value)
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ========================================================================== */
/* SCHEDULE                                                                   */
/* ========================================================================== */

export const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const scheduleFields = {
  id: (s) => pick(s, 'id', 'pk'),
  title: (s) =>
    pick(s, 'title', 'name', 'workout_name') ??
    // Some APIs only nest the exercise; fall back to its name.
    (typeof s?.exercise === 'object' ? exerciseFields.name(s.exercise) : undefined) ??
    'Workout',
  /** ISO YYYY-MM-DD, or undefined for a weekday-based schedule. */
  date: (s) => {
    const raw = pick(s, 'date', 'scheduled_date', 'day');
    if (!raw) return undefined;
    // A weekday name in `day` is not a date.
    if (WEEKDAYS.includes(String(raw).toLowerCase())) return undefined;
    return String(raw).slice(0, 10);
  },
  /** Lowercase weekday name, or undefined for a date-based schedule. */
  weekday: (s) => {
    const raw = pick(s, 'day_of_week', 'weekday', 'day');
    if (raw == null) return undefined;
    if (typeof raw === 'number') return WEEKDAYS[raw % 7];
    const lower = String(raw).toLowerCase();
    return WEEKDAYS.includes(lower) ? lower : undefined;
  },
  time: (s) => {
    const raw = pick(s, 'time', 'start_time', 'scheduled_time');
    return raw ? String(raw).slice(0, 5) : '';
  },
  duration: (s) => Number(pick(s, 'duration', 'duration_minutes', 'minutes') ?? 0),
  notes: (s) => pick(s, 'notes', 'description') ?? '',
  completed: (s) => Boolean(pick(s, 'completed', 'is_completed', 'done') ?? false),
  /** Exercise id whether the API nests the object or returns a bare id. */
  exerciseId: (s) => {
    const raw = s?.exercise ?? s?.exercise_id;
    return typeof raw === 'object' ? exerciseFields.id(raw) : raw;
  },
  sets: (s) => pick(s, 'sets'),
  reps: (s) => pick(s, 'reps'),
};

/**
 * Normalised shape the calendar UI works with. `date` is always an ISO string:
 * a weekday-only entry is projected onto that weekday of the visible week.
 */
export function normalizeScheduleEntry(raw) {
  return {
    id: scheduleFields.id(raw),
    title: scheduleFields.title(raw),
    date: scheduleFields.date(raw),
    weekday: scheduleFields.weekday(raw),
    time: scheduleFields.time(raw),
    duration: scheduleFields.duration(raw),
    notes: scheduleFields.notes(raw),
    completed: scheduleFields.completed(raw),
    exerciseId: scheduleFields.exerciseId(raw),
    sets: scheduleFields.sets(raw),
    reps: scheduleFields.reps(raw),
    raw, // kept so PUT can resend untouched fields
  };
}

/**
 * POST /api/schedule/create/ body.
 * Sends both `date` and `day_of_week` so it works whether your model is
 * date-based or weekday-based — drop whichever one your serializer rejects.
 */
export function toApiScheduleEntry(form) {
  const body = {
    title: form.title,
    date: form.date,
    day_of_week: weekdayOf(form.date),
  };
  if (form.time) body.time = form.time.length === 5 ? `${form.time}:00` : form.time;
  if (form.duration !== '' && form.duration != null) body.duration = Number(form.duration);
  if (form.notes) body.notes = form.notes;
  if (form.exerciseId) body.exercise = form.exerciseId;
  if (form.sets !== '' && form.sets != null) body.sets = Number(form.sets);
  if (form.reps !== '' && form.reps != null) body.reps = Number(form.reps);
  return body;
}

/**
 * PUT body for an existing entry. PUT replaces the whole object, so this
 * spreads the original payload and overrides only what changed.
 */
export function toApiScheduleUpdate(entry, changes = {}) {
  const { raw = {} } = entry;
  const body = { ...raw };
  delete body.id;
  delete body.pk;

  if ('completed' in changes) {
    // Write to whichever completion field the object actually came with.
    const key = ['completed', 'is_completed', 'done'].find((k) => k in raw) ?? 'completed';
    body[key] = changes.completed;
  }
  if ('title' in changes) body.title = changes.title;
  if ('notes' in changes) body.notes = changes.notes;

  // Nested read-only objects must go back as ids.
  if (body.exercise && typeof body.exercise === 'object') {
    body.exercise = exerciseFields.id(body.exercise);
  }
  return body;
}

export function weekdayOf(iso) {
  if (!iso) return undefined;
  const d = new Date(`${iso}T00:00:00`);
  return WEEKDAYS[(d.getDay() + 6) % 7];
}

export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Expands entries onto a concrete date range.
 * Date-based entries pass straight through; weekday-based entries repeat on
 * every matching day, so a weekly template still fills the calendar.
 */
export function expandToRange(entries, startIso, endIso) {
  const out = [];
  const start = new Date(`${startIso}T00:00:00`);
  const end = new Date(`${endIso}T00:00:00`);

  for (const e of entries) {
    if (e.date) {
      if (e.date >= startIso && e.date <= endIso) out.push(e);
      continue;
    }
    if (!e.weekday) continue;

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (WEEKDAYS[(d.getDay() + 6) % 7] === e.weekday) {
        out.push({ ...e, date: toISODate(d), recurring: true });
      }
    }
  }
  return out;
}

/* ========================================================================== */
/* DERIVED STATS                                                              */
/* ========================================================================== */

/**
 * There is no /api/stats/ endpoint, so the dashboard computes its numbers from
 * the schedule list. Swap this out if you add a stats endpoint later.
 */
export function deriveStats(entries, today = new Date()) {
  const todayIso = toISODate(today);
  const done = entries.filter((e) => e.completed);

  // Current streak: consecutive days back from today with a completed session.
  const completedDays = new Set(done.map((e) => e.date).filter(Boolean));
  let streak = 0;
  const cursor = new Date(today);
  while (completedDays.has(toISODate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  // Monday-first current week.
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const iso = toISODate(d);
    const forDay = entries.filter((e) => e.date === iso);
    return {
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      iso,
      minutes: forDay.filter((e) => e.completed).reduce((a, e) => a + (e.duration || 0), 0),
      planned: forDay.length,
      completed: forDay.filter((e) => e.completed).length,
    };
  });

  return {
    totalSessions: done.length,
    currentStreak: streak,
    totalMinutes: done.reduce((a, e) => a + (e.duration || 0), 0),
    upcoming: entries
      .filter((e) => e.date && e.date >= todayIso && !e.completed)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    week,
    thisWeek: {
      done: week.reduce((a, d) => a + d.completed, 0),
      planned: week.reduce((a, d) => a + d.planned, 0),
    },
  };
}
