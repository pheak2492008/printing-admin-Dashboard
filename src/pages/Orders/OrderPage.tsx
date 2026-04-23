<<<<<<< HEAD
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
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="4"
      y="13"
      width="28"
      height="16"
      rx="3"
      className="fill-white/25 stroke-white"
      strokeWidth="1.8"
    />
    <rect
      x="9"
      y="7"
      width="18"
      height="8"
      rx="2"
      className="fill-white/15 stroke-white"
      strokeWidth="1.6"
    />
    <rect
      x="10"
      y="22"
      width="16"
      height="10"
      rx="1.5"
      className="fill-white/90"
    />
    <line
      x1="13"
      y1="25.5"
      x2="23"
      y2="25.5"
      stroke="#6366f1"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
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
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || "bg-gray-100 text-gray-700"}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${dotColors[status] || "bg-gray-400"}`}
      />
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
        {
          id: 1,
          clientName: "John Doe",
          dimensions: "2m x 5m",
          dpi: "High Res",
          status: "In Progress",
        },
        {
          id: 2,
          clientName: "Sarah Miller",
          dimensions: "1.5m x 1.5m",
          dpi: "Low Res",
          status: "Pending",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Orders
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {loading ? "Updating..." : `${orders.length} orders total`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                ⌕
              </span>
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
              <span className="text-xl">+</span>{" "}
              <span className="hidden sm:inline">New Order</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {["All", "Pending", "In Progress", "Completed"].map((t) => (
            <div
              key={t}
              onClick={() => setFilter(t as FilterTab)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${filter === t ? "bg-white border-indigo-500 ring-2 ring-indigo-50/50" : "bg-white border-slate-100 hover:border-slate-300"}`}
            >
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                {t}
              </p>
              <p className="text-2xl font-bold mt-1">
                {orders.filter((o) => t === "All" || o.status === t).length}
              </p>
            </div>
          ))}
        </div>

        {/* Orders Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-bottom border-slate-100">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Dimensions
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                          {(order.clientName || "U")[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {order.clientName || order.client}
                          </p>
                          <p className="text-xs text-slate-400 font-mono">
                            #{order.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                      {order.dimensions}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors">
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal - Simplified Backdrop */}
      {showModal && (
        <NewOrderModalTailwind onClose={() => setShowModal(false)} />
      )}
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
            <label className="block text-sm font-semibold mb-1.5 text-slate-700">
              Client Name
            </label>
            <input
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Acme Corp"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-slate-700">
              Dimensions
            </label>
            <input
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. 24x36in"
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl font-semibold border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button className="flex-1 px-6 py-3 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
              Create
            </button>
          </div>
        </div>
=======
import React, { useState, useEffect, useCallback } from "react";
import { ExternalLink, Trash2, Printer, MessageSquare } from "lucide-react";

interface Order {
  orderId: number;
  customerName: string;
  phoneNumber: string;
  width: number;
  length: number;
  totalPrice: number;
  status: "PENDING" | "PRINTING" | "COMPLETED";
  designFileUrl: string;
  description?: string;
}

export default function PrintQueueDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8081/api/orders/getall");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("API Error", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(
        `http://localhost:8081/api/orders/${id}/status?status=${status}`,
        { method: "PUT" },
      );
      if (res.ok) fetchOrders();
    } catch (err) {
      alert("Update failed");
    }
  };

  // ✅ 1. THE DELETE FUNCTION
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order forever?",
    );

    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:8081/api/orders/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchOrders(); // Refresh table
        } else {
          alert("Failed to delete the order.");
        }
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-10 font-sans">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-5xl font-black italic tracking-tighter text-slate-900">
            PRINTQUEUE PRO
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">
            Admin Control Panel
          </p>
        </div>
        <div className="flex gap-2">
          {["All", "PENDING", "PRINTIN", "COMPLETED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${filter === tab ? "bg-slate-900 text-white" : "bg-white text-slate-400 border border-slate-200"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-8 py-5">Customer</th>
              <th className="px-8 py-5">Order Details</th>
              <th className="px-8 py-5">Total</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders
              .filter((o) => filter === "All" || o.status === filter)
              .map((order) => (
                <tr
                  key={order.orderId}
                  className="hover:bg-slate-50/50 transition-all"
                >
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-900 text-lg italic tracking-tighter">
                      {order.customerName}
                    </p>
                    <p className="text-xs font-bold text-slate-400 tracking-widest">
                      {order.phoneNumber}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-600 text-sm">
                      {order.width}m x {order.length}m
                    </p>

                    {order.description && (
                      <div className="flex items-start gap-1 mt-2 p-2 bg-blue-50/50 rounded-lg border border-blue-100 max-w-[250px]">
                        <MessageSquare
                          size={12}
                          className="text-blue-500 mt-1 flex-shrink-0"
                        />
                        <p className="text-[11px] font-bold text-blue-700 leading-tight">
                          "{order.description}"
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() =>
                        window.open(
                          `http://localhost:8081${order.designFileUrl}`,
                        )
                      }
                      className="text-indigo-600 text-[10px] font-black uppercase mt-3 flex items-center gap-1 hover:underline"
                    >
                      View Design <ExternalLink size={12} />
                    </button>
                  </td>
                  <td className="px-8 py-6 font-black text-blue-600">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border ${order.status === "PENDING" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-blue-50 text-blue-600 border-blue-200"}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      {order.status === "PENDING" && (
                        <button
                          onClick={() =>
                            updateStatus(order.orderId, "PRINTING")
                          }
                          className="p-2 bg-slate-900 text-white rounded-lg hover:bg-blue-600 transition-all"
                        >
                          <Printer size={16} />
                        </button>
                      )}

                      {/* ✅ 2. CONNECTED THE DELETE FUNCTION HERE */}
                      <button
                        onClick={() => handleDelete(order.orderId)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {loading && (
          <div className="p-20 text-center font-black text-slate-300 italic animate-pulse">
            Syncing Database...
          </div>
        )}
>>>>>>> staging
      </div>
    </div>
  );
}
