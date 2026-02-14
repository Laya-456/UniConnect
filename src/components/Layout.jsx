import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/mood', label: 'Mood Tracker' },
  { to: '/mood-meter', label: 'Campus Mood' },
  { to: '/match', label: 'Connect' },
  { to: '/chat', label: 'Chat' },
  { to: '/kindness', label: 'Kindness Wall' },
  { to: '/wellness', label: 'Wellness' },
  { to: '/clubs', label: 'Clubs' },
  { to: '/profile', label: 'Profile' },
];

const WEEK_THEMES = [
  { id: 'default', label: 'Default' },
  { id: 'nature', label: 'Nature' },
  { id: 'neon', label: 'Neon' },
  { id: 'retro', label: 'Retro' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white/95 flex">
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-50 border-r border-slate-200 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-200">
            <h1 className="text-lg font-semibold text-primary-600">UniConnect</h1>
            <p className="text-xs text-slate-500 mt-0.5">Connecting Campus</p>
          </div>
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-500 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="p-3 border-t border-slate-200 space-y-2">
            <p className="px-3 py-1 text-xs font-medium text-slate-500 uppercase tracking-wide">Theme of the Week</p>
            <div className="flex flex-wrap gap-1.5">
              {WEEK_THEMES.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTheme(id)}
                  className={`btn-micro px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors theme-week-btn theme-week-btn-${id} ${
                    theme === id ? 'theme-week-btn-active' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-3 border-t border-slate-200">
            <div className="px-3 py-2 text-sm text-slate-600 truncate">{user?.full_name}</div>
            <button
              onClick={handleLogout}
              type="button"
              className="btn-micro w-full px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Log out
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 flex items-center gap-4 h-14 px-4 bg-white border-b border-slate-200 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            className="p-2 rounded-lg hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-semibold text-primary-600">UniConnect</span>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div key={location.pathname} className="page-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}
    </div>
  );
}
