import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useLenis } from './hooks/useLenis';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import Login from './components/Navbar/Login';
import Signup from './pages/Signup';

import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';

export default function App() {
  useLenis();

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Authenticated app shell.
              TODO(django): wrap in a <RequireAuth> guard once JWT login is live. */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
