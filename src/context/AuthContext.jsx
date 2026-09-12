import { useState, useEffect, useCallback } from 'react';
import * as api from '../utils/api';
import { AuthContext } from './auth-context';

/**
 * Minimal auth container. While the backend is mocked this simply keeps the
 * user in memory + localStorage. Once Django is live, `api.login` / `api.getMe`
 * become real calls and nothing in this file needs to change.
 */

const USER_KEY = 'fitpulse.user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
      else localStorage.removeItem(USER_KEY);
    } catch {
      /* storage unavailable (private mode) — session-only auth is fine */
    }
  }, [user]);

  const signIn = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const { user: u } = await api.login(credentials);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (payload) => {
    setLoading(true);
    try {
      const { user: u } = await api.register(payload);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await api.logout();
    setUser(null);
  }, []);

  const patchUser = useCallback(async (patch) => {
    const updated = await api.updateProfile(patch);
    setUser(updated);
    return updated;
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut, patchUser, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}
