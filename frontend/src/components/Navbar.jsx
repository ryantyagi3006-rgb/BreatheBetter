import { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Pulse, List, X } from '@phosphor-icons/react';
import { useApp } from '../context/AppContext';
import BreathMark from './BreathMark';

function useDark() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const toggle = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('bb-dark', isDark ? '1' : '');
    setDark(isDark);
  };
  return [dark, toggle];
}

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, signOut, connected, handleConnect } = useApp();
  const [dark, toggleDark] = useDark();
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  const toggleLang = () => {
    const next = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('bb-lang', next);
  };

  const links = [
    { to: '/', label: t('nav_home') },
    ...(user ? [{ to: '/dashboard', label: t('nav_dashboard') }, { to: '/history', label: t('nav_history') }] : []),
    { to: '/about', label: t('nav_about') },
    { to: '/outreach', label: t('nav_outreach') },
    { to: '/safe-use', label: t('nav_safe_use') },
  ];

  const linkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
      isActive
        ? 'bg-navy-900 text-white dark:bg-navy-500'
        : 'text-navy-600 dark:text-lightblue hover:bg-navy-100/60 dark:hover:bg-white/10'
    }`;

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-navy-100/60 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Logo — BreatheBetter mark beside the DPS International logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <BreathMark className="w-9 h-9 text-navy-600 dark:text-lightblue" />
          <div className="leading-tight">
            <p className="text-lg font-extrabold text-navy-900 dark:text-white tracking-tight">{t('brand')}</p>
            <p className="text-[10px] text-navy-500 dark:text-lightblue/80 italic -mt-0.5">{t('tagline')}</p>
          </div>
          <span className="hidden md:block w-px h-9 bg-navy-200/70 dark:bg-white/15" />
          <span className="hidden md:flex items-center rounded-md px-2 py-1 dark:bg-white">
            <img src="/dps-logo.png" alt="DPS International" className="h-6 w-auto object-contain" />
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {links.map(l => <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>{l.label}</NavLink>)}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <button onClick={toggleLang} className="btn-secondary text-xs px-3 py-2 hidden sm:block" aria-label="Toggle language">
            {i18n.language === 'en' ? 'हिन्दी' : 'EN'}
          </button>
          <button onClick={toggleDark} className="btn-secondary px-3 py-2 flex items-center" aria-label="Toggle dark mode">
            {dark ? <Sun size={16} weight="bold" /> : <Moon size={16} weight="bold" />}
          </button>

          {/* Connect pill — only meaningful when logged in */}
          {user && (
            <button
              onClick={() => handleConnect(t)}
              className={`hidden md:flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border transition-all duration-200 ${
                connected
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                  : 'bg-white dark:bg-white/10 border-navy-200 dark:border-white/20 text-navy-900 dark:text-white hover:bg-navy-50 dark:hover:bg-white/15'
              }`}
            >
              <Pulse size={16} weight="bold" />
              <span>{connected ? t('disconnect') : t('connect_device')}</span>
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]' : 'bg-slate-300'}`} />
            </button>
          )}

          {/* Auth */}
          {user ? (
            <button onClick={signOut} className="btn-secondary text-xs px-3 py-2 hidden sm:block">{t('sign_out')}</button>
          ) : (
            <Link to="/login" className="btn-primary text-xs px-4 py-2">{t('login_btn_short')}</Link>
          )}

          {/* Mobile menu toggle */}
          <button onClick={() => setOpen(o => !o)} className="lg:hidden btn-secondary px-2.5 py-2 flex items-center" aria-label="Menu">
            {open ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="lg:hidden border-t border-navy-100/60 dark:border-white/10 px-4 py-3 flex flex-col gap-1 bg-white/95 dark:bg-[#0f2137]/95 animate-fade-in">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setOpen(false)} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          {user && (
            <button onClick={() => { handleConnect(t); setOpen(false); }} className="btn-secondary text-sm mt-1 md:hidden flex items-center justify-center gap-2">
              {connected && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
              {connected ? t('disconnect') : t('connect_device')}
            </button>
          )}
          <div className="flex gap-2 mt-2">
            <button onClick={toggleLang} className="btn-secondary text-xs flex-1 sm:hidden">
              {i18n.language === 'en' ? 'हिन्दी' : 'English'}
            </button>
            {user && <button onClick={signOut} className="btn-secondary text-xs flex-1 sm:hidden">{t('sign_out')}</button>}
          </div>
          {user && <p className="text-xs text-navy-400 dark:text-lightblue/70 mt-2 px-3 truncate">{user.email}</p>}
        </nav>
      )}
    </header>
  );
}
