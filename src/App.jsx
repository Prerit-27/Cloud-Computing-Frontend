import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import CalendarPage from './pages/CalendarPage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';
import { useAuth } from './hooks/useAppData';
import { startDemoSession } from './utils/api';
import { useEffect, useState } from 'react';

function AppRoutes() {
  const { user, setUser, loading, login, signup, logout } = useAuth();
  const [authError, setAuthError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && ['/login', '/signup'].includes(location.pathname)) navigate('/', { replace: true });
  }, [user, location.pathname, navigate]);

  const submitAuth = async (mode, payload) => {
    setAuthError('');
    try { await (mode === 'signup' ? signup(payload) : login(payload)); navigate('/', { replace: true }); }
    catch (error) { setAuthError(error.message || 'Unable to authenticate. Please try again.'); }
  };

  const enterDemo = () => {
    const demoUser = startDemoSession();
    setUser(demoUser);
    navigate('/', { replace: true });
  };

  if (!user && !['/login', '/signup'].includes(location.pathname)) return <Navigate to="/login" replace />;
  if (['/login', '/signup'].includes(location.pathname)) {
    return <AuthPage key={location.pathname} mode={location.pathname.slice(1)} onSubmit={(payload) => submitAuth(location.pathname.slice(1), payload)} onDemo={enterDemo} loading={loading} error={authError} onModeChange={(mode) => { setAuthError(''); navigate(`/${mode}`); }} />;
  }

  return <AppShell user={user} onLogout={async () => { await logout(); navigate('/login', { replace: true }); }}>
    <Routes>
      <Route path="/" element={<Home user={user} />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/progress" element={<ProgressPage />} />
      <Route path="/profile" element={<ProfilePage user={user} onUserChange={setUser} onLogout={async () => { await logout(); navigate('/login', { replace: true }); }} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AppShell>;
}

export default function App() {
  return <BrowserRouter><AppRoutes /></BrowserRouter>;
}
