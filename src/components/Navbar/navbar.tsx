import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

// ── Icons ────────────────────────────────────────────────────────────────────

const IconGrid = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const IconOrders = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="2" />
    <path d="M9 12h6M9 16h4" />
  </svg>
);

const IconReport = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
  </svg>
);

const IconProfile = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconPrint = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

const IconInventory = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <path d="M2 17h20" />
    <path d="M6 21h12" />
  </svg>
);

const IconLogout = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { path: "/", label: "Dashboard", icon: <IconGrid /> },
    { path: "/orders", label: "Orders", icon: <IconOrders />, badge: 12 },
    { path: "/inventory", label: "Inventory", icon: <IconInventory /> },
    { path: "/reports", label: "Reports", icon: <IconReport /> },
    { path: "/profile", label: "Profile", icon: <IconProfile /> },
  ];

  const handleLogout = () => {
    // Add your logout logic here (e.g., localStorage.clear())
    console.log("Logging out...");
    navigate("/login");
  };

  return (
    <aside
      className={`relative flex flex-col bg-white border-r border-gray-100 transition-all duration-300 shadow-sm ${isCollapsed ? "w-[72px]" : "w-64"}`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 hover:bg-blue-600 hover:text-white transition-colors"
      >
        <svg
          className={`w-3 h-3 transition-transform ${isCollapsed ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Brand */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-50 overflow-hidden">
        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-100">
          <IconPrint />
        </div>
        {!isCollapsed && (
          <div className="whitespace-nowrap">
            <h1 className="text-[15px] font-extrabold text-blue-600 leading-tight">
              PrintQueue Pro
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Admin Panel
            </p>
          </div>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 flex flex-col gap-1 p-3">
        {!isCollapsed && (
          <p className="px-3 pb-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            Main Menu
          </p>
        )}

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive ? "bg-blue-50 text-blue-600 font-semibold" : "text-slate-400 hover:bg-slate-50 hover:text-blue-500"}`
            }
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!isCollapsed && (
              <span className="flex-1 text-sm">{item.label}</span>
            )}
            {!isCollapsed && item.badge && (
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}

            {/* Tooltip for collapsed mode */}
            {isCollapsed && (
              <div className="absolute left-14 invisible group-hover:visible bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User & Logout Section */}
      <div className="p-4 border-t border-gray-50 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            AD
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">
                Admin User
              </p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-[11px] text-red-500 font-medium hover:text-red-700 transition-colors"
              >
                <IconLogout /> Sign Out
              </button>
            </div>
          )}
          {isCollapsed && (
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <IconLogout />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
