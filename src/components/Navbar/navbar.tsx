import { useState } from "react";

// ── Icons ────────────────────────────────────────────────────────────────────

const IconGrid = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
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

const IconOrders = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
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

const IconInventory = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconProfile = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconPrint = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
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

const IconChevron = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconLogout = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
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

const IconBell = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

// ── Types ────────────────────────────────────────────────────────────────────

type NavItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
};

// This interface is the most important part to fix your error!
interface NavbarProps {
  activeItem: string;
  onNavigate: (key: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

// ── Nav Data ─────────────────────────────────────────────────────────────────

const navItems: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: <IconGrid /> },
  { key: "orders", label: "Orders", icon: <IconOrders />, badge: 12 },
  { key: "inventory", label: "Inventory", icon: <IconInventory /> },
  { key: "profile", label: "Profile", icon: <IconProfile /> },
];

// ── Styles ───────────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .pq-sidebar {
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    width: 260px;
    min-height: 100vh;
    background: #ffffff;
    border-right: 1px solid #f0f0f0;
    display: flex;
    flex-direction: column;
    padding: 0;
    transition: width 0.25s cubic-bezier(.4,0,.2,1);
    position: relative;
    box-shadow: 2px 0 24px rgba(37, 99, 235, 0.04);
    flex-shrink: 0;
  }

  .pq-sidebar.collapsed { width: 72px; }

  .pq-brand {
    padding: 28px 20px 20px;
    border-bottom: 1px solid #f5f5f5;
    display: flex;
    align-items: center;
    gap: 12px;
    overflow: hidden;
  }

  .pq-brand-icon {
    width: 38px; height: 38px;
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: white; flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }

  .pq-brand-text { overflow: hidden; transition: opacity 0.2s, width 0.25s; white-space: nowrap; }
  .collapsed .pq-brand-text { opacity: 0; width: 0; }
  .pq-brand-name { font-size: 16px; font-weight: 800; color: #2563eb; letter-spacing: -0.3px; line-height: 1.2; }
  .pq-brand-sub { font-size: 10px; font-weight: 600; color: #94a3b8; letter-spacing: 0.12em; text-transform: uppercase; margin-top: 1px; }

  .pq-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 2px; overflow: hidden; }
  .pq-nav-label { font-size: 10px; font-weight: 700; color: #cbd5e1; letter-spacing: 0.12em; text-transform: uppercase; padding: 4px 8px 10px; white-space: nowrap; overflow: hidden; transition: opacity 0.2s; }
  .collapsed .pq-nav-label { opacity: 0; }

  .pq-nav-item {
    display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px;
    cursor: pointer; border: none; background: transparent; width: 100%; text-align: left;
    font-family: inherit; font-size: 14px; font-weight: 500; color: #94a3b8; transition: all 0.15s ease;
    position: relative; white-space: nowrap; overflow: hidden;
  }

  .pq-nav-item:hover { background: #f1f5fe; color: #2563eb; }
  .pq-nav-item.active { background: #eff6ff; color: #2563eb; font-weight: 600; }
  .pq-nav-item.active::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 60%; background: #2563eb; border-radius: 0 3px 3px 0; }
  .pq-nav-icon { width: 18px; height: 18px; color: #cbd5e1; flex-shrink: 0; transition: color 0.15s; }
  .pq-nav-item.active .pq-nav-icon { color: #2563eb; }

  .pq-badge { background: #2563eb; color: white; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 20px; min-width: 18px; text-align: center; line-height: 16px; }
  .pq-divider { height: 1px; background: #f5f5f5; margin: 8px 12px; flex-shrink: 0; }

  .pq-user { padding: 16px 12px; border-top: 1px solid #f5f5f5; display: flex; align-items: center; gap: 10px; overflow: hidden; cursor: pointer; transition: background 0.15s; }
  .pq-avatar { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 13px; font-weight: 700; flex-shrink: 0; }
  .pq-user-name { font-size: 13px; font-weight: 600; color: #1e293b; }
  .pq-user-role { font-size: 11px; color: #94a3b8; }

  .pq-collapse-btn {
    position: absolute; top: 32px; right: -13px; width: 26px; height: 26px;
    background: #fff; border: 1px solid #e2e8f0; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #94a3b8; transition: all 0.2s; z-index: 10;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  }
  .pq-collapse-btn:hover { background: #2563eb; color: white; }
  .collapsed .pq-collapse-btn svg { transform: rotate(180deg); }

  .pq-notification-dot { position: absolute; top: 8px; right: 10px; width: 7px; height: 7px; background: #ef4444; border-radius: 50%; border: 1.5px solid #fff; }
`;

// ── Component ─────────────────────────────────────────────────────────────────

export default function Navbar({
  activeItem, // Required prop from App.tsx
  onNavigate, // Required prop from App.tsx
  collapsed: controlledCollapsed,
  onToggleCollapse,
}: NavbarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const isCollapsed = controlledCollapsed ?? internalCollapsed;

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed((v) => !v);
    }
  };

  return (
    <>
      <style>{css}</style>
      <aside className={`pq-sidebar${isCollapsed ? " collapsed" : ""}`}>
        <button className="pq-collapse-btn" onClick={handleToggle}>
          <IconChevron size={13} />
        </button>

        <div className="pq-brand">
          <div className="pq-brand-icon">
            <IconPrint size={20} />
          </div>
          <div className="pq-brand-text">
            <div className="pq-brand-name">PrintQueue Pro</div>
            <div className="pq-brand-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="pq-nav">
          <div className="pq-nav-label">Main Menu</div>

          {navItems.map((item) => (
            <button
              key={item.key}
              className={`pq-nav-item${activeItem === item.key ? " active" : ""}`}
              onClick={() => onNavigate(item.key)}
            >
              <span className="pq-nav-icon">{item.icon}</span>
              <span className="pq-nav-item-label">{item.label}</span>
              {item.badge && <span className="pq-badge">{item.badge}</span>}
            </button>
          ))}

          <div className="pq-divider" />

          <button className="pq-nav-item" style={{ position: "relative" }}>
            <span className="pq-nav-icon">
              <IconBell size={18} />
            </span>
            <span className="pq-nav-item-label">Notifications</span>
            <span className="pq-notification-dot" />
          </button>
        </nav>

        <div className="pq-user">
          <div className="pq-avatar">AD</div>
          <div className="pq-user-info">
            <div className="pq-user-name">Admin User</div>
            <div className="pq-user-role">Administrator</div>
          </div>
          <div className="pq-logout-btn">
            <IconLogout size={16} />
          </div>
        </div>
      </aside>
    </>
  );
}
