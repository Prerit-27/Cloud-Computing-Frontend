import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useLenis } from './hooks/useLenis';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/auth-context';

import Home from './pages/Home';
import Login from './components/Navbar/Login';
import Signup from './pages/Signup';

import AppLayout from './components/layout/AppLayout';
import RequireAuth from './components/layout/RequireAuth';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Exercises from './pages/Exercises';
import Profile from './pages/Profile';

function GuestOnly({ children }) {
  const { status } = useAuth();

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-[#070707] grid place-items-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#7CFF5B]" />
      </div>
    );
  }

  return status === 'authed' ? <Navigate to="/app/dashboard" replace /> : children;
}

export default function App() {
  useLenis();

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
          <Route path="/signup" element={<GuestOnly><Signup /></GuestOnly>} />

          {/* Authenticated app */}
          <Route
            path="/app"
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="exercises" element={<Exercises />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
