import React, { useState, useEffect, useCallback, useMemo, memo } from "react";

// --- Types ---
interface Order {
  id: number | string;
  orderId?: string;
  clientName?: string;
  client?: string;
  previewUrl?: string;
  dimensions?: string;
  dpi?: string | number;
  status: "Pending" | "In Progress" | "Completed" | string;
  createdAt?: string;
}

type FilterTab = "All" | "Pending" | "In Progress" | "Completed";

// --- Sub-Components (Memoized for Performance) ---

const PrinterLogo = memo(({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="13" width="28" height="16" rx="3" className="fill-white/25 stroke-white" strokeWidth="1.8" />
    <rect x="9" y="7" width="18" height="8" rx="2" className="fill-white/15 stroke-white" strokeWidth="1.6" />
    <rect x="10" y="22" width="16" height="10" rx="1.5" className="fill-white/90" />
    <line x1="13" y1="25.5" x2="23" y2="25.5" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="27" cy="19" r="2" fill="#a5f3fc" />
  </svg>
));

const StatusBadge = memo(({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
    Completed: "bg-green-100 text-green-800 border-green-200",
  };
  const dotColors: Record<string, string> = {
    Pending: "bg-yellow-500",
    "In Progress": "bg-blue-500",
    Completed: "bg-green-500",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status] || "bg-gray-400"}`} />
      {status}
    </span>
  );
});

// --- Main Dashboard ---

export default function PrintQueueDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("All");
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch Logic
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8081/api/orders/getall");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch {
      setError("Using demo data (API offline)");
      setOrders([
        { id: 1, clientName: "John Doe", dimensions: "2m x 5m", dpi: "High Res", status: "In Progress" },
        { id: 2, clientName: "Sarah Miller", dimensions: "1.5m x 1.5m", dpi: "Low Res", status: "Pending" },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Derived State (useMemo for performance)
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchTab = filter === "All" || o.status === filter;
      const q = search.toLowerCase();
      const client = (o.clientName || o.client || "").toLowerCase();
      return matchTab && (client.includes(q) || String(o.id).includes(q));
    });
  }, [orders, filter, search]);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Orders</h1>
            <p className="text-slate-500 text-sm mt-1">{loading ? "Updating..." : `${orders.length} orders total`}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
              <input 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
            >
              <span className="text-xl">+</span> <span className="hidden sm:inline">New Order</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {["All", "Pending", "In Progress", "Completed"].map((t) => (
            <div 
              key={t}
              onClick={() => setFilter(t as FilterTab)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${filter === t ? 'bg-white border-indigo-500 ring-2 ring-indigo-50/50' : 'bg-white border-slate-100 hover:border-slate-300'}`}
            >
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{t}</p>
              <p className="text-2xl font-bold mt-1">{orders.filter(o => t === "All" || o.status === t).length}</p>
            </div>
          ))}
        </div>

        {/* Orders Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-bottom border-slate-100">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Dimensions</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                          {(order.clientName || "U")[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{order.clientName || order.client}</p>
                          <p className="text-xs text-slate-400 font-mono">#{order.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-mono">{order.dimensions}</td>
                    <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors">🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal - Simplified Backdrop */}
      {showModal && <NewOrderModalTailwind onClose={() => setShowModal(false)} />}
    </div>
  );
}

// --- Sidebar Content ---
function SidebarContent() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="bg-indigo-600 p-2 rounded-xl shadow-indigo-200 shadow-lg">
          <PrinterLogo size={24} />
        </div>
        <span className="font-bold text-lg tracking-tight">PrintQueue <span className="text-indigo-600">Pro</span></span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {["Dashboard", "Orders", "Inventory", "Settings"].map((item) => (
          <div key={item} className={`px-4 py-3 rounded-xl cursor-pointer font-medium transition-colors ${item === 'Orders' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
            {item}
          </div>
        ))}
      </nav>
    </div>
  );
}

// --- Modal Component ---
function NewOrderModalTailwind({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl scale-in-center">
        <h2 className="text-2xl font-bold mb-6">Create New Order</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-slate-700">Client Name</label>
            <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Acme Corp" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-slate-700">Dimensions</label>
            <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 24x36in" />
          </div>
          <div className="flex gap-4 pt-4">
            <button onClick={onClose} className="flex-1 px-6 py-3 rounded-xl font-semibold border border-slate-200 hover:bg-slate-50 transition-colors">Cancel</button>
            <button className="flex-1 px-6 py-3 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">Create</button>
          </div>
        </div>
      </div>
    </div>
  );
}