import { useState, useEffect, useCallback } from 'react';
import * as api from '../utils/api';
import { AuthContext } from './auth-context';

/**
 * Holds the signed-in user.
 *
 * On mount, if a DRF token is in localStorage we call GET /api/profile/ to
 * confirm it is still valid and to load the user. A 401 clears the token.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // 'checking' until the initial /profile/ probe settles, so guarded routes
  // don't bounce a logged-in user to /login on a hard refresh.
  const [status, setStatus] = useState(() => (api.auth.isAuthenticated() ? 'checking' : 'anon'));

  useEffect(() => {
    if (!api.auth.isAuthenticated()) return undefined;

    let cancelled = false;
    api
      .getProfile()
      .then((me) => {
        if (cancelled) return;
        setUser(me);
        setStatus('authed');
      })
      .catch(() => {
        if (cancelled) return;
        api.auth.clearToken();
        setStatus('anon');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (credentials) => {
    const data = await api.login(credentials);
    // Some backends return the user with the token, some only the token.
    const me = data?.user ?? (await api.getProfile());
    setUser(me);
    setStatus('authed');
    return me;
  }, []);

  const signUp = useCallback(async (payload) => {
    const data = await api.register(payload);

    // If registration did not hand back a token, the user must log in.
    if (!api.auth.isAuthenticated()) {
      setStatus('anon');
      return null;
    }
    const me = data?.user ?? (await api.getProfile());
    setUser(me);
    setStatus('authed');
    return me;
  }, []);

  const signOut = useCallback(async () => {
    await api.logout();
    setUser(null);
    setStatus('anon');
  }, []);

  const refreshUser = useCallback(async () => {
    const me = await api.getProfile();
    setUser(me);
    return me;
  }, []);

  const patchUser = useCallback(async (patch) => {
    const updated = await api.updateProfile(patch);
    setUser(updated);
    return updated;
  }, []);

  const deleteAccount = useCallback(async () => {
    await api.deleteAccount();
    setUser(null);
    setStatus('anon');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        status,
        loading: status === 'checking',
        isAuthenticated: status === 'authed',
        signIn,
        signUp,
        signOut,
        refreshUser,
        patchUser,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
