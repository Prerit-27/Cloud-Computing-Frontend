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

  // /login/ and /register/ return {id, username, email, date_joined}; /profile/
  // returns names, bio, phone and picture. Merge both into one user object.
  const loadMe = useCallback(async (base) => {
    const profile = await api.getProfile();
    return { ...base, ...profile };
  }, []);

  const signIn = useCallback(
    async (credentials) => {
      const data = await api.login(credentials);
      const me = await loadMe(data?.user);
      setUser(me);
      setStatus('authed');
      return me;
    },
    [loadMe]
  );

  const signUp = useCallback(
    async (payload, profileExtras) => {
      const data = await api.register(payload);
      if (!api.auth.isAuthenticated()) {
        setStatus('anon');
        return null;
      }
      // Register only accepts username/email/password; names go via PATCH.
      if (profileExtras && Object.keys(profileExtras).length) {
        try {
          await api.updateProfile(profileExtras);
        } catch {
          /* non-fatal: the account exists, names can be set on the profile page */
        }
      }
      const me = await loadMe(data?.user);
      setUser(me);
      setStatus('authed');
      return me;
    },
    [loadMe]
  );

  const signOut = useCallback(async () => {
    await api.logout();
    setUser(null);
    setStatus('anon');
  }, []);

  /** Drops local session state without calling /logout/ (token already invalid). */
  const clearSession = useCallback(() => {
    api.auth.clearToken();
    setUser(null);
    setStatus('anon');
  }, []);

  const refreshUser = useCallback(async () => {
    const profile = await api.getProfile();
    setUser((prev) => ({ ...prev, ...profile }));
    return profile;
  }, []);

  const patchUser = useCallback(async (patch) => {
    const updated = await api.updateProfile(patch);
    setUser((prev) => ({ ...prev, ...updated }));
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
        clearSession,
        refreshUser,
        patchUser,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
