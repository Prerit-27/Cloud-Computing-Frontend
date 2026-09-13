import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, clearSession, getStoredUser, saveSession } from '../utils/api';

export function useAuth() {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);

  const authenticate = useCallback(async (method, payload) => {
    setLoading(true);
    try {
      const result = await api.auth[method](payload);
      const session = result?.data || result;
      saveSession(session);
      setUser(session?.user || session?.profile || payload);
      return session;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try { await api.auth.logout(); } finally { clearSession(); setUser(null); }
  }, []);

  return useMemo(() => ({ user, setUser, loading, login: (payload) => authenticate('login', payload), signup: (payload) => authenticate('signup', payload), logout }), [user, loading, authenticate, logout]);
}

export function useResource(loader) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try { setData(await loader()); } catch (err) { setError(err.message || 'Something went wrong.'); } finally { setLoading(false); }
  }, [loader]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { reload(); }, [reload]);
  return { data, setData, loading, error, reload };
}

