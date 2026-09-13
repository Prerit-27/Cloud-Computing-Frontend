const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
const DEMO_KEY = 'fitpulse_demo';
const DEMO_DATA_KEY = 'fitpulse_demo_data';

const dateFromToday = (amount) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + amount);
  return date.toISOString().slice(0, 10);
};

const initialDemoData = () => ({
  schedule: [
    { id: 'demo-today', date: dateFromToday(0), muscle: 'Chest', exercises: ['Barbell bench press', 'Incline dumbbell press', 'Cable fly'] },
    { id: 'demo-back', date: dateFromToday(1), muscle: 'Back', exercises: ['Lat pulldown', 'Seated cable row', 'Romanian deadlift'] },
    { id: 'demo-legs', date: dateFromToday(2), muscle: 'Quads', exercises: ['Back squat', 'Leg press', 'Walking lunges'] },
    { id: 'demo-shoulders', date: dateFromToday(4), muscle: 'Shoulders', exercises: ['Overhead press', 'Lateral raise', 'Face pulls'] },
  ],
  progress: [
    { id: 'demo-picture-1', date: dateFromToday(-28), url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=1000&fit=crop&q=85' },
    { id: 'demo-picture-2', date: dateFromToday(-14), url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=1000&fit=crop&q=85' },
  ],
  profile: { id: 'demo-user', name: 'Alex Morgan', email: 'alex@fitpulse.demo', bio: 'Building consistency one session at a time.' },
});

const readDemoData = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(DEMO_DATA_KEY) || 'null');
    if (saved) return saved;
  } catch { /* Use fresh demo data when storage is unavailable or invalid. */ }
  const fresh = initialDemoData();
  localStorage.setItem(DEMO_DATA_KEY, JSON.stringify(fresh));
  return fresh;
};

const writeDemoData = (data) => {
  localStorage.setItem(DEMO_DATA_KEY, JSON.stringify(data));
  return data;
};

const isDemoSession = () => localStorage.getItem(DEMO_KEY) === 'true';
const demoResult = (value) => Promise.resolve(value);

function getToken() {
  return localStorage.getItem('fitpulse_token');
}

export function startDemoSession() {
  localStorage.setItem(DEMO_KEY, 'true');
  const user = readDemoData().profile;
  saveSession({ token: 'fitpulse-demo-token', user });
  return user;
}

export function saveSession(session) {
  if (session?.token) localStorage.setItem('fitpulse_token', session.token);
  if (session?.user) localStorage.setItem('fitpulse_user', JSON.stringify(session.user));
}

export function clearSession() {
  localStorage.removeItem('fitpulse_token');
  localStorage.removeItem('fitpulse_user');
  localStorage.removeItem(DEMO_KEY);
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('fitpulse_user') || 'null');
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getToken();
  if (!(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const contentType = response.headers.get('content-type') || '';
  const body = response.status === 204 ? null : contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof body === 'object' && body
      ? body.message || body.error || body.detail
      : body;
    throw new Error(message || `Request failed (${response.status})`);
  }
  return body;
}

const unwrap = (value, keys) => {
  if (!value) return value;
  for (const key of keys) if (value[key] !== undefined) return value[key];
  return value;
};

const demoProfile = () => readDemoData().profile;
const demoFileUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

export const api = {
  auth: {
    login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
    signup: (payload) => request('/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),
    logout: () => isDemoSession() ? demoResult(null) : request('/auth/logout', { method: 'POST' }),
  },
  profile: {
    get: async () => isDemoSession() ? demoProfile() : unwrap(await request('/profile'), ['profile', 'user', 'data']),
    update: async (payload) => {
      if (isDemoSession()) {
        const data = readDemoData();
        data.profile = { ...data.profile, ...payload };
        writeDemoData(data);
        return data.profile;
      }
      return unwrap(await request('/profile', { method: 'PUT', body: JSON.stringify(payload) }), ['profile', 'user', 'data']);
    },
    picture: async (file) => {
      if (isDemoSession()) {
        const data = readDemoData();
        data.profile = { ...data.profile, profilePicture: await demoFileUrl(file) };
        writeDemoData(data);
        return data.profile;
      }
      const form = new FormData();
      form.append('picture', file);
      return unwrap(await request('/profile/picture', { method: 'POST', body: form }), ['profile', 'user', 'data']);
    },
    remove: () => {
      if (isDemoSession()) {
        localStorage.removeItem(DEMO_DATA_KEY);
        return demoResult(null);
      }
      return request('/profile', { method: 'DELETE' });
    },
  },
  schedule: {
    list: async () => isDemoSession() ? readDemoData().schedule : unwrap(await request('/schedule'), ['schedule', 'schedules', 'data']) || [],
    create: (payload) => {
      if (isDemoSession()) {
        const data = readDemoData();
        const item = { ...payload, id: `demo-${Date.now()}` };
        data.schedule = [...data.schedule, item];
        writeDemoData(data);
        return demoResult(item);
      }
      return request('/schedule', { method: 'POST', body: JSON.stringify(payload) });
    },
    update: (id, payload) => {
      if (isDemoSession()) {
        const data = readDemoData();
        data.schedule = data.schedule.map((item) => String(item.id) === String(id) ? { ...item, ...payload } : item);
        writeDemoData(data);
        return demoResult(data.schedule.find((item) => String(item.id) === String(id)));
      }
      return request(`/schedule/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    },
    remove: (id) => {
      if (isDemoSession()) {
        const data = readDemoData();
        data.schedule = data.schedule.filter((item) => String(item.id) !== String(id));
        writeDemoData(data);
        return demoResult(null);
      }
      return request(`/schedule/${id}`, { method: 'DELETE' });
    },
  },
  progress: {
    list: async () => isDemoSession() ? readDemoData().progress : unwrap(await request('/progress'), ['progress', 'pictures', 'data']) || [],
    upload: async (file, date) => {
      if (isDemoSession()) {
        const data = readDemoData();
        const picture = { id: `demo-picture-${Date.now()}`, date: date || dateFromToday(0), url: await demoFileUrl(file) };
        data.progress = [...data.progress, picture];
        writeDemoData(data);
        return picture;
      }
      const form = new FormData();
      form.append('picture', file);
      if (date) form.append('date', date);
      return request('/progress', { method: 'POST', body: form });
    },
    remove: (id) => {
      if (isDemoSession()) {
        const data = readDemoData();
        data.progress = data.progress.filter((item) => String(item.id) !== String(id));
        writeDemoData(data);
        return demoResult(null);
      }
      return request(`/progress/${id}`, { method: 'DELETE' });
    },
  },
};

export { API_BASE_URL, isDemoSession };
