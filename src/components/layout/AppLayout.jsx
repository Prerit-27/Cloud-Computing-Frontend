import { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import {
  Dumbbell,
  LayoutDashboard,
  CalendarDays,
  User,
  Activity,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
} from 'lucide-react';
import { useAuth } from '../../context/auth-context';
import { MOCK_USER } from '../../utils/mockData';
import { initialsOf } from '../../utils/format';

const NAV = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/app/profile', label: 'Profile', icon: User },
];

const SECONDARY = [
  { to: '/#muscles', label: 'Muscle Guide', icon: Activity, external: true },
  { to: '/', label: 'Back to site', icon: Home, external: true },
];

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Falls back to mock data so the pages are viewable without logging in.
  const current = user ?? MOCK_USER;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <Link
        to="/"
        className="flex items-center gap-2.5 px-6 h-20 shrink-0 border-b border-white/[0.06]"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7CFF5B] to-[#5BE7FF] grid place-items-center shadow-lg shadow-[#7CFF5B]/20">
          <Dumbbell className="w-5 h-5 text-[#070707]" strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold tracking-tight">
          Fit<span className="text-[#7CFF5B]">Pulse</span>
        </span>
      </Link>

      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-bold tracking-[0.18em] uppercase text-white/25">
          Menu
        </p>
        <div className="space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#7CFF5B]/10 text-[#7CFF5B]'
                    : 'text-[#B8B8B8] hover:text-white hover:bg-white/[0.04]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[#7CFF5B]" />
                  )}
                  <Icon className="w-[18px] h-[18px]" />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <p className="px-3 mt-8 mb-2 text-[10px] font-bold tracking-[0.18em] uppercase text-white/25">
          Explore
        </p>
        <div className="space-y-1">
          {SECONDARY.map(({ to, label, icon: Icon }) => (
            <Link
              key={label}
              to={to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#B8B8B8] hover:text-white hover:bg-white/[0.04] transition-all duration-200"
            >
              <Icon className="w-[18px] h-[18px]" />
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* User card */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.03]">
          <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-[#7CFF5B] to-[#5BE7FF] grid place-items-center text-[#070707] text-sm font-bold">
            {initialsOf(current)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">
              {current.firstName} {current.lastName}
            </p>
            <p className="text-xs text-white/35 truncate">{current.email}</p>
          </div>
        </div>
        <div className="flex gap-1 mt-1">
          <Link
            to="/app/profile"
            onClick={() => setOpen(false)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#B8B8B8] hover:text-white hover:bg-white/[0.04] transition"
          >
            <Settings className="w-3.5 h-3.5" />
            Settings
          </Link>
          <button
            onClick={handleSignOut}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#B8B8B8] hover:text-[#FF5B5B] hover:bg-[#FF5B5B]/10 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[264px] flex-col bg-[#0C0C0C] border-r border-white/[0.06] z-40">
        {SidebarContent}
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-[#0C0C0C]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7CFF5B] to-[#5BE7FF] grid place-items-center">
            <Dumbbell className="w-4 h-4 text-[#070707]" strokeWidth={2.5} />
          </div>
          <span className="font-bold">
            Fit<span className="text-[#7CFF5B]">Pulse</span>
          </span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="w-10 h-10 grid place-items-center rounded-lg bg-[#181818] border border-white/[0.08]"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[280px] bg-[#0C0C0C] border-r border-white/[0.06]">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-6 w-9 h-9 grid place-items-center rounded-lg bg-[#181818] border border-white/[0.08] z-10"
            >
              <X className="w-4 h-4" />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}

      <main className="lg:pl-[264px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
