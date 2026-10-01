import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../../utils/data';
import { useAuth } from '../../context/auth-context';
import { displayName, initialsOf, mediaUrl, userFields } from '../../utils/adapters';

function ProfileLink({ user, onClick, mobile = false }) {
  const avatar = mediaUrl(userFields.avatar(user));

  return (
    <Link
      to="/app/profile"
      onClick={onClick}
      aria-label={`View ${displayName(user)}'s profile`}
      className={mobile
        ? 'flex items-center gap-3 px-8 py-3 text-sm font-medium text-white rounded-xl bg-[#181818] border border-[rgba(255,255,255,0.08)] hover:bg-[#222] transition-colors'
        : 'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-[#B8B8B8] hover:text-white hover:bg-white/[0.04] transition-colors'}
    >
      <span className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-[#7CFF5B] to-[#5BE7FF] grid place-items-center text-[#070707] text-xs font-bold overflow-hidden">
        {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : initialsOf(user)}
      </span>
      <span className="max-w-36 truncate">{displayName(user)}</span>
    </Link>
  );
}

function GuestActions({ mobile = false, onNavigate }) {
  return (
    <>
      <Link
        to="/login"
        onClick={onNavigate}
        className={mobile
          ? 'px-8 py-3 text-sm font-medium text-white rounded-xl bg-[#181818] border border-[rgba(255,255,255,0.08)] hover:bg-[#222] transition-colors'
          : 'px-4 py-2 text-sm font-medium text-[#B8B8B8] hover:text-[#070707] transition-colors duration-200'}
      >
        Login
      </Link>
      <Link
        to="/signup"
        onClick={onNavigate}
        className={mobile
          ? 'px-8 py-3 text-sm font-semibold bg-[#7CFF5B] text-[#070707] rounded-xl hover:scale-105 transition-transform shadow-lg shadow-[#7CFF5B]/20'
          : 'px-5 py-2 text-sm font-semibold bg-white text-[#070707] rounded-xl hover:bg-[#7CFF5B] transition-all duration-300 hover:scale-105 shadow-lg shadow-white/5'}
      >
        Get Started
      </Link>
    </>
  );
}

export default function Navbar() {
  const { user, status } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const accountActions = (mobile = false) => {
    if (status === 'checking') {
      return <div aria-label="Loading account" className="w-28 h-10 rounded-xl bg-white/[0.05] animate-pulse" />;
    }
    return status === 'authed'
      ? <ProfileLink user={user} mobile={mobile} onClick={() => setMenuOpen(false)} />
      : <GuestActions mobile={mobile} onNavigate={() => setMenuOpen(false)} />;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#070707]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.04)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <a href="#home" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7CFF5B] to-[#5BE7FF] flex items-center justify-center shadow-lg shadow-[#7CFF5B]/20 transition-transform duration-300 group-hover:scale-105">
                <Dumbbell className="w-5 h-5 text-[#070707]" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Fit<span className="text-[#7CFF5B]">Pulse</span>
              </span>
            </a>

            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className="relative px-3.5 py-2 text-sm font-medium text-[#B8B8B8] hover:text-white transition-colors duration-200 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#7CFF5B] rounded-full transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">{accountActions()}</div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg bg-[#181818] border border-[rgba(255,255,255,0.08)]"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#070707]/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                  className="text-2xl font-medium text-[#B8B8B8] hover:text-white py-2 transition-colors duration-200"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="flex flex-col items-center gap-3 mt-8"
              >
                {accountActions(true)}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
