/**
 * Placeholder data so the app-side pages render something realistic before the
 * Django backend exists. Every export here has a matching function in api.js —
 * when the real endpoints land, delete this file and the fallbacks in api.js.
 */

export const MOCK_USER = {
  id: 1,
  username: 'danieldao',
  firstName: 'Daniel',
  lastName: 'Dao',
  email: 'daniel@example.com',
  avatar: null, // falls back to initials
  bio: 'Training 5 days a week. Chasing a 180kg deadlift before the end of the year.',
  location: 'Auckland, NZ',
  joinedAt: '2025-11-04',
  dateOfBirth: '2002-06-17',
  gender: 'male',
  heightCm: 178,
  weightKg: 76.4,
  goalWeightKg: 82,
  experience: 'intermediate', // beginner | intermediate | advanced
  primaryGoal: 'build_muscle', // build_muscle | lose_fat | strength | endurance
  weeklyTarget: 5,
  units: 'metric', // metric | imperial
  equipment: ['Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight'],
};

export const MOCK_STATS = {
  totalWorkouts: 148,
  currentStreak: 12,
  longestStreak: 31,
  totalVolumeKg: 412750,
  hoursTrained: 196,
  thisWeek: { done: 4, target: 5 },
};

/** Sunday-first weekly volume, most recent 7 entries. */
export const MOCK_WEEKLY_VOLUME = [
  { day: 'Mon', volume: 8200 },
  { day: 'Tue', volume: 6400 },
  { day: 'Wed', volume: 0 },
  { day: 'Thu', volume: 9100 },
  { day: 'Fri', volume: 7350 },
  { day: 'Sat', volume: 5800 },
  { day: 'Sun', volume: 0 },
];

export const MOCK_PERSONAL_BESTS = [
  { lift: 'Deadlift', weightKg: 170, reps: 1, date: '2026-08-28' },
  { lift: 'Back Squat', weightKg: 140, reps: 1, date: '2026-08-14' },
  { lift: 'Bench Press', weightKg: 102.5, reps: 1, date: '2026-09-02' },
  { lift: 'Overhead Press', weightKg: 65, reps: 1, date: '2026-07-21' },
];

export const MOCK_ACHIEVEMENTS = [
  { id: 'streak30', label: '30 Day Streak', icon: 'flame', earned: true },
  { id: 'vol100', label: '100 Workouts', icon: 'trophy', earned: true },
  { id: 'earlybird', label: 'Early Bird', icon: 'sunrise', earned: true },
  { id: 'bodyweight2x', label: '2x Bodyweight Deadlift', icon: 'zap', earned: true },
  { id: 'century', label: '100kg Bench', icon: 'medal', earned: true },
  { id: 'year', label: '1 Year Member', icon: 'calendar', earned: false },
];

/** Workout types drive the colour coding across the calendar. */
export const WORKOUT_TYPES = {
  push: { label: 'Push', color: '#7CFF5B' },
  pull: { label: 'Pull', color: '#5BE7FF' },
  legs: { label: 'Legs', color: '#FF5B8A' },
  upper: { label: 'Upper Body', color: '#B75BFF' },
  cardio: { label: 'Cardio', color: '#FFB85B' },
  rest: { label: 'Rest / Mobility', color: '#8A8A8A' },
};

/**
 * Calendar sessions. `date` is a plain YYYY-MM-DD string so it maps cleanly to
 * a Django DateField and avoids timezone drift in the UI.
 */
const seedSessions = [
  { title: 'Push Day A', type: 'push', time: '06:30', duration: 65, exercises: 6, volumeKg: 8200 },
  { title: 'Pull Day A', type: 'pull', time: '06:30', duration: 70, exercises: 7, volumeKg: 9100 },
  { title: 'Leg Day', type: 'legs', time: '17:00', duration: 80, exercises: 6, volumeKg: 12400 },
  { title: 'Upper Body', type: 'upper', time: '07:00', duration: 60, exercises: 8, volumeKg: 7350 },
  { title: 'Zone 2 Run', type: 'cardio', time: '18:30', duration: 45, exercises: 1, volumeKg: 0 },
  { title: 'Mobility Flow', type: 'rest', time: '20:00', duration: 25, exercises: 5, volumeKg: 0 },
];

/** Builds a believable spread of sessions around today's date. */
export function buildMockSessions(reference = new Date()) {
  const out = [];
  const pattern = [0, 1, 2, 3, 4, 5]; // index into seedSessions
  let id = 1;

  for (let offset = -45; offset <= 20; offset += 1) {
    const d = new Date(reference);
    d.setDate(d.getDate() + offset);
    const dow = d.getDay();

    // Rest on Sundays, and skip a scattering of days so it doesn't look generated.
    if (dow === 0) continue;
    if ((offset + 90) % 7 === 3) continue;

    const seed = seedSessions[pattern[(offset + 45) % pattern.length]];
    out.push({
      id: id++,
      date: toISODate(d),
      completed: offset < 0,
      ...seed,
    });
  }
  return out;
}

export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const MOCK_RECENT_ACTIVITY = [
  { id: 1, text: 'Completed Push Day A', detail: '6 exercises · 8,200 kg', when: '2 hours ago' },
  { id: 2, text: 'New PR on Bench Press', detail: '102.5 kg × 1', when: 'Yesterday' },
  { id: 3, text: 'Completed Leg Day', detail: '6 exercises · 12,400 kg', when: '3 days ago' },
  { id: 4, text: 'Updated weekly target', detail: '4 → 5 sessions', when: '5 days ago' },
];
