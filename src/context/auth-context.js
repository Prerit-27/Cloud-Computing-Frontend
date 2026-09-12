import { createContext, useContext } from 'react';

/** Context object + consumer hook, kept separate from the provider component
 *  so that Vite fast-refresh stays happy. */
export const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
