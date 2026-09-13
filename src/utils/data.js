import { Activity, CalendarDays, Camera, UserRound } from 'lucide-react';

export const NAV_ITEMS = [
  { label: 'Home', to: '/', icon: Activity },
  { label: 'Calendar', to: '/calendar', icon: CalendarDays },
  { label: 'Progress', to: '/progress', icon: Camera },
  { label: 'Profile', to: '/profile', icon: UserRound },
];

// Coordinates are percentages of the body artwork: front view, head at 0%, feet at 100%.
export const MUSCLE_GROUPS = [
  { id: 'shoulders', label: 'Shoulders', top: '18%', left: '29%', side: 'both', color: '#5BE7FF' },
  { id: 'chest', label: 'Chest', top: '25%', left: '50%', side: 'front', color: '#7CFF5B' },
  { id: 'biceps', label: 'Biceps', top: '29%', left: '24%', side: 'both', color: '#FFB85B' },
  { id: 'triceps', label: 'Triceps', top: '29%', left: '76%', side: 'both', color: '#FFB85B' },
  { id: 'forearms', label: 'Forearms', top: '39%', left: '17%', side: 'both', color: '#B75BFF' },
  { id: 'back', label: 'Back', top: '31%', left: '50%', side: 'back', color: '#FF5B8A' },
  { id: 'core', label: 'Core', top: '38%', left: '50%', side: 'front', color: '#5B7CFF' },
  { id: 'glutes', label: 'Glutes', top: '49%', left: '50%', side: 'back', color: '#FF8A5B' },
  { id: 'quads', label: 'Quads', top: '59%', left: '42%', side: 'front', color: '#FF5BC5' },
  { id: 'hamstrings', label: 'Hamstrings', top: '59%', left: '58%', side: 'back', color: '#5BE7FF' },
  { id: 'calves', label: 'Calves', top: '78%', left: '57%', side: 'both', color: '#7CFF5B' },
];

export const MUSCLE_ALIASES = {
  shoulder: 'shoulders', shoulders: 'shoulders', chest: 'chest', pectorals: 'chest',
  bicep: 'biceps', biceps: 'biceps', tricep: 'triceps', triceps: 'triceps',
  forearm: 'forearms', forearms: 'forearms', back: 'back', core: 'core', abs: 'core',
  glute: 'glutes', glutes: 'glutes', quads: 'quads', quadriceps: 'quads',
  hamstring: 'hamstrings', hamstrings: 'hamstrings', calves: 'calves', calf: 'calves',
};

export const normalizeMuscle = (value = '') => MUSCLE_ALIASES[String(value).trim().toLowerCase()] || String(value).trim().toLowerCase();
export const getScheduleDate = (item) => item?.date || item?.scheduledDate || item?.workoutDate || '';
export const getScheduleMuscle = (item) => item?.muscle || item?.muscleGroup || item?.targetMuscle || '';
export const getExercises = (item) => item?.exercises || item?.workouts || [];
export const formatDate = (date, options = { month: 'short', day: 'numeric', year: 'numeric' }) => date ? new Intl.DateTimeFormat(undefined, options).format(new Date(`${date}T00:00:00`)) : 'No date';
export const todayISO = () => new Date().toISOString().slice(0, 10);
export const getExerciseName = (exercise) => typeof exercise === 'string' ? exercise : exercise?.name || exercise?.title || 'Exercise';
export const emptySchedule = { date: todayISO(), muscle: '', exercises: [] };
