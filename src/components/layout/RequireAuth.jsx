import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/auth-context';

/**
 * Gate for /app/*. While the stored token is being verified against
 * GET /api/profile/ we render a spinner — redirecting during that window would
 * kick a signed-in user to /login on every hard refresh.
 */
export default function RequireAuth({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-[#070707] grid place-items-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#7CFF5B]" />
      </div>
    );
  }

  if (status !== 'authed') {
    // `from` lets the login page send the user back where they were headed.
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
