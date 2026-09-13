import { useState } from 'react';
import { Dumbbell, LogOut, Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { isDemoSession } from '../utils/api';
import { NAV_ITEMS } from '../utils/data';

export default function AppShell({ user, onLogout, children }) {
  const [open, setOpen] = useState(false);
  const initials = (user?.name || user?.fullName || user?.email || 'FP').slice(0, 2).toUpperCase();

  return (
    <div className="app-shell min-h-screen bg-[#070707] text-white">
      <header className="site-header sticky top-0 z-40 border-b border-white/[0.06] bg-[#070707]/90 backdrop-blur-xl">
        <div className="site-header-inner">
          <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
            <span className="brand-mark"><Dumbbell className="h-5 w-5 text-[#070707]" strokeWidth={2.5} /></span>
            <span className="brand-name">Fit<span>Pulse</span></span>
          </NavLink>

          <nav className="desktop-nav" aria-label="Main navigation">
            {NAV_ITEMS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="desktop-user-menu">
            <NavLink to="/profile" className="user-link">
              {user?.profilePicture || user?.avatar ? <img src={user.profilePicture || user.avatar} alt="" className="user-avatar" /> : <span className="user-avatar user-initials">{initials}</span>}
              <span className="user-name">{user?.name || user?.fullName || 'My profile'}</span>
            </NavLink>
            {isDemoSession() && <span className="demo-badge">Demo preview</span>}
            <button onClick={onLogout} className="logout-button" aria-label="Log out"><LogOut className="h-4 w-4" /></button>
          </div>

          <button onClick={() => setOpen((value) => !value)} className="mobile-menu-button" aria-label="Toggle navigation">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && <nav className="mobile-nav" aria-label="Mobile navigation">
          {NAV_ITEMS.map((link) => <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={() => setOpen(false)} className={({ isActive }) => `mobile-nav-link ${isActive ? 'is-active' : ''}`}>{link.label}</NavLink>)}
          <button onClick={onLogout} className="mobile-logout"><LogOut className="h-4 w-4" /> Leave preview</button>
        </nav>}
      </header>
      <main>{children}</main>
    </div>
  );
}
