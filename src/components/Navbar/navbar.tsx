import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
<<<<<<< HEAD

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
=======
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  BarChart2,
  User,
  LogOut,
  ChevronLeft,
  Printer,
} from "lucide-react";
>>>>>>> staging

// ── Component ─────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const navItems = [
<<<<<<< HEAD
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
=======
    { path: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    {
      path: "/orders",
      label: "Orders",
      icon: <ClipboardList size={20} />,
      badge: 12,
    },
    { path: "/inventory", label: "Inventory", icon: <Package size={20} /> },
    { path: "/reviews", label: "Reviews", icon: <BarChart2 size={20} /> },
    { path: "/profile", label: "Profile", icon: <User size={20} /> },
  ];

  const handleLogout = () => {
    // 1. Clear Authentication State
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");

    // 2. Redirect to Login and Force App Refresh
    window.location.href = "/login";
>>>>>>> staging
  };

  return (
    <aside
<<<<<<< HEAD
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
=======
      className={`relative flex flex-col bg-white border-r border-slate-100 transition-all duration-300 shadow-sm z-50 ${
        isCollapsed ? "w-[78px]" : "w-64"
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
      >
        <ChevronLeft
          size={14}
          className={`transition-transform ${isCollapsed ? "rotate-180" : ""}`}
        />
      </button>

      {/* Brand Section */}
      <div
        className={`flex items-center gap-3 p-6 mb-2 overflow-hidden transition-all ${isCollapsed ? "justify-center" : ""}`}
      >
        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-100">
          <Printer size={22} />
        </div>
        {!isCollapsed && (
          <div className="whitespace-nowrap animate-in fade-in duration-500">
            <h1 className="text-lg font-black text-slate-800 leading-tight tracking-tighter">
              Printing Service<span className="text-blue-600">Shop</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Admin Console
>>>>>>> staging
            </p>
          </div>
        )}
      </div>

<<<<<<< HEAD
      {/* Nav Links */}
      <nav className="flex-1 flex flex-col gap-1 p-3">
        {!isCollapsed && (
          <p className="px-3 pb-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
=======
      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1.5 p-4">
        {!isCollapsed && (
          <p className="px-3 pb-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
>>>>>>> staging
            Main Menu
          </p>
        )}

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
<<<<<<< HEAD
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive ? "bg-blue-50 text-blue-600 font-semibold" : "text-slate-400 hover:bg-slate-50 hover:text-blue-500"}`
=======
              `group relative flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-100 font-bold"
                  : "text-slate-400 hover:bg-slate-50 hover:text-blue-600"
              }`
>>>>>>> staging
            }
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!isCollapsed && (
<<<<<<< HEAD
              <span className="flex-1 text-sm">{item.label}</span>
            )}
            {!isCollapsed && item.badge && (
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
=======
              <span className="flex-1 text-sm tracking-tight">
                {item.label}
              </span>
            )}
            {!isCollapsed && item.badge && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  window.location.pathname === item.path
                    ? "bg-white text-blue-600"
                    : "bg-blue-600 text-white"
                }`}
              >
>>>>>>> staging
                {item.badge}
              </span>
            )}

<<<<<<< HEAD
            {/* Tooltip for collapsed mode */}
            {isCollapsed && (
              <div className="absolute left-14 invisible group-hover:visible bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
=======
            {/* Tooltip for Collapsed Mode */}
            {isCollapsed && (
              <div className="absolute left-16 invisible group-hover:visible bg-slate-900 text-white text-[10px] font-bold px-3 py-2 rounded-lg whitespace-nowrap z-50 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
>>>>>>> staging
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

<<<<<<< HEAD
      {/* User & Logout Section */}
      <div className="p-4 border-t border-gray-50 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
=======
      {/* User Footer & Logout */}
      <div className="p-4 bg-slate-50/50 border-t border-slate-100">
        <div
          className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-inner flex-shrink-0">
>>>>>>> staging
            AD
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
<<<<<<< HEAD
              <p className="text-sm font-semibold text-slate-700 truncate">
=======
              <p className="text-xs font-black text-slate-800 truncate">
>>>>>>> staging
                Admin User
              </p>
              <button
                onClick={handleLogout}
<<<<<<< HEAD
                className="flex items-center gap-1 text-[11px] text-red-500 font-medium hover:text-red-700 transition-colors"
              >
                <IconLogout /> Sign Out
=======
                className="flex items-center gap-1.5 text-[10px] text-rose-500 font-bold hover:text-rose-700 transition-colors uppercase tracking-wider"
              >
                <LogOut size={12} /> Sign Out
>>>>>>> staging
              </button>
            </div>
          )}
          {isCollapsed && (
            <button
              onClick={handleLogout}
<<<<<<< HEAD
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <IconLogout />
=======
              className="absolute bg-white border border-slate-200 p-2 rounded-xl text-rose-500 shadow-sm hover:bg-rose-50 transition-all mb-20"
              title="Sign Out"
            >
              <LogOut size={18} />
>>>>>>> staging
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
