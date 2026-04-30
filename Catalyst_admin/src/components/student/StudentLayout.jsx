// ============================================================
// STUDENT LAYOUT
// Root layout wrapper for the /student/* route tree.
// Renders the fixed left sidebar (StudentSidebar) and the
// main content area (filled by nested <Outlet /> routes).
// ============================================================

import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import catalystLogo from '../../assets/catalyst-logo.png';

// ─────────────────────────────────────────────────────────────
// NAV ITEM — single link in the sidebar
// ─────────────────────────────────────────────────────────────
function NavItem({ to, icon, label, onClick }) {
  if (onClick) {
    // Used for the Logout button (not a NavLink)
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
      >
        <span className="text-base w-5 text-center">{icon}</span>
        {label}
      </button>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
          isActive
            ? 'bg-teal-500/20 text-teal-300'
            : 'text-gray-400 hover:text-white hover:bg-white/8'
        }`
      }
    >
      <span className="text-base w-5 text-center">{icon}</span>
      {label}
    </NavLink>
  );
}

// ─────────────────────────────────────────────────────────────
// STUDENT SIDEBAR
// Left fixed sidebar with navigation links and user info.
// ─────────────────────────────────────────────────────────────
function StudentSidebar({ user, onLogout }) {
  return (
    <aside
      className="flex flex-col w-[220px] shrink-0 h-screen sticky top-0 overflow-y-auto"
      style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/8 shrink-0">
        <img src={catalystLogo} alt="Catalyst" className="h-7 w-auto object-contain" />
        <div>
          <p className="text-sm font-extrabold text-white leading-none">Catalyst</p>
          <p className="text-[10px] text-teal-400 mt-0.5">Student Portal</p>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <NavItem to="/student/dashboard"   icon="🏠" label="Dashboard"      />
        <NavItem to="/student/assignments" icon="📝" label="My Assignments"  />
        <NavItem to="/student/profile"     icon="👤" label="Profile"         />
      </nav>

      {/* User info + logout */}
      <div className="px-3 py-4 border-t border-white/8 space-y-2 shrink-0">
        {/* User card */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/5">
          <div className="w-8 h-8 rounded-lg bg-teal-500/30 flex items-center justify-center text-xs font-extrabold text-teal-300 shrink-0">
            {(user?.name || 'S').slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.name || 'Student'}</p>
            <p className="text-[10px] text-gray-400 truncate">{user?.email || ''}</p>
          </div>
        </div>
        <NavItem icon="🚪" label="Logout" onClick={onLogout} />
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────
// STUDENT LAYOUT (default export)
// Wraps all /student/* pages with sidebar + main area.
// ─────────────────────────────────────────────────────────────
export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <StudentSidebar user={user} onLogout={handleLogout} />

      {/* Main content — each child route renders here */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
