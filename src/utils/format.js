/** Small display helpers shared across the app pages. */

export function initialsOf(user) {
  const f = user?.firstName?.[0] ?? '';
  const l = user?.lastName?.[0] ?? '';
  return (f + l).toUpperCase() || 'U';
}

export function formatKg(kg) {
  if (!kg) return '—';
  return kg >= 1000 ? `${(kg / 1000).toFixed(1)}t` : `${kg} kg`;
}
