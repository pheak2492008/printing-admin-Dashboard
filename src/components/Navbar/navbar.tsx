import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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

export default function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const navItems = [
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

  // --- UPDATED LOGOUT LOGIC ---
  const handleLogout = async () => {
    try {
      // 1. Call the backend API
      const response = await fetch("http://localhost:8081/api/auth/logout", {
        method: "POST", // Change to 'GET' if your backend specifically requires it
        headers: {
          "Content-Type": "application/json",
          // Uncomment if you need to send the token for the server to invalidate it
          // "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
      });

      if (!response.ok) {
        console.warn(
          "Server-side logout failed, but clearing local session anyway.",
        );
      }
    } catch (error) {
      console.error("Network error during logout:", error);
    } finally {
      // 2. Clear Authentication State (Client Side)
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userRole");
      localStorage.removeItem("token"); // Good practice to remove the token too

      // 3. Redirect to Login
      window.location.href = "/login";
    }
  };
  // ----------------------------

  return (
    <aside
      className={`relative flex flex-col bg-white border-r border-slate-100 transition-all duration-300 shadow-sm z-50 ${
        isCollapsed ? "w-[78px]" : "w-64"
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
      >
        <ChevronLeft
          size={14}
          className={`transition-transform ${isCollapsed ? "rotate-180" : ""}`}
        />
      </button>

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
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 flex flex-col gap-1.5 p-4">
        {!isCollapsed && (
          <p className="px-3 pb-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
            Main Menu
          </p>
        )}

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-100 font-bold"
                  : "text-slate-400 hover:bg-slate-50 hover:text-blue-600"
              }`
            }
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!isCollapsed && (
              <span className="flex-1 text-sm tracking-tight">
                {item.label}
              </span>
            )}
            {isCollapsed && (
              <div className="absolute left-16 invisible group-hover:visible bg-slate-900 text-white text-[10px] font-bold px-3 py-2 rounded-lg whitespace-nowrap z-50 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 bg-slate-50/50 border-t border-slate-100">
        <div
          className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-inner flex-shrink-0">
            AD
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-800 truncate">
                Admin User
              </p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-[10px] text-rose-500 font-bold hover:text-rose-700 transition-colors uppercase tracking-wider"
              >
                <LogOut size={12} /> Sign Out
              </button>
            </div>
          )}
          {isCollapsed && (
            <button
              onClick={handleLogout}
              className="absolute bg-white border border-slate-200 p-2 rounded-xl text-rose-500 shadow-sm hover:bg-rose-50 transition-all mb-20"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
