import { useState } from "react";
// ─── Types ───────────────────────────────────────────────────────────────────
type OrderStatus = "Pending" | "Printing" | "Done" | "Cancelled";

interface Order {
  id: string;
  client: string;
  specs: { size: string; priority: "High" | "Low" | "Normal" };
  file: string;
  filePages: number;
  status: OrderStatus;
}

interface InventoryItem {
  name: string;
  used: number;
  total: number;
  unit: string;
  low: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const orders: Order[] = [
  {
    id: "#100",
    client: "Phalla",
    specs: { size: "2m x 5m", priority: "High" },
    file: "A.xlsx",
    filePages: 3,
    status: "Pending",
  },
  {
    id: "#101",
    client: "Sophol",
    specs: { size: "1m x 3m", priority: "Low" },
    file: "1.PDF",
    filePages: 2,
    status: "Printing",
  },
  {
    id: "#102",
    client: "Dara",
    specs: { size: "A4", priority: "Normal" },
    file: "Doc.pdf",
    filePages: 10,
    status: "Done",
  },
];

const inventory: InventoryItem[] = [
  { name: "PVC Matte", used: 45, total: 100, unit: "100m", low: false },
  { name: "Vinyl Sticker", used: 85, total: 100, unit: "100m", low: true },
  { name: "Mesh Fabric", used: 72, total: 100, unit: "100m", low: false },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const styles: Record<OrderStatus, string> = {
    Pending: "bg-blue-100 text-blue-600",
    Printing: "bg-green-100 text-green-600",
    Done: "bg-gray-100 text-gray-500",
    Cancelled: "bg-red-100 text-red-500",
  };
  return (
    <span
      className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
};

const PriorityTag = ({ priority }: { priority: "High" | "Low" | "Normal" }) => {
  const styles: Record<string, string> = {
    High: "bg-red-100 text-red-600",
    Low: "bg-yellow-100 text-yellow-600",
    Normal: "bg-gray-100 text-gray-500",
  };
  return (
    <span
      className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded ${styles[priority]}`}
    >
      {priority}
    </span>
  );
};

const InventoryBar = ({ item }: { item: InventoryItem }) => {
  const pct = (item.used / item.total) * 100;
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{item.name}</span>
        <span className="text-xs text-gray-400">
          {item.used}m / {item.unit}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: item.low ? "#f87171" : "#0ea5e9",
          }}
        />
      </div>
    </div>
  );
};

// ─── Main Dashboard Component ──────────────────────────────────────────────────

// 1. Updated to accept onNavigate prop
export default function PrintQueueDashboard({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* ── Sidebar ── */}
      <aside className="w-full lg:w-64 bg-white border-b lg:border-r border-gray-200 lg:min-h-screen p-4 flex lg:flex-col justify-between items-center lg:items-start shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-200">
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M6 9V4h12v5M3 9h18v9H3V9zM6 14h12M6 18h12" />
            </svg>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-gray-900 leading-tight">
              PrintQueue Pro
            </h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
              Admin Panel
            </p>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 font-medium rounded-xl">
              Dashboard
            </a>
            <a href="" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl">
              Orders
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl">
              Inventory
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl">
              Reports
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl">
              Profile
            </a>
          </div>
        </nav>

        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 overflow-hidden">
            <img src="https://ui-avatars.com/api/?name=Admin" alt="User" />
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
          <p className="text-sm text-gray-500">
            Welcome back! Here is what's happening today.
          </p>
        </header>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Revenue",
              value: "$1,240",
              change: "+12%",
              up: true,
            },
            { label: "Active Orders", value: "12", change: "+5%", up: true },
            { label: "Completion Rate", value: "94%", change: "+2%", up: true },
            {
              label: "Low Stock",
              value: "2 Items",
              change: "⚠ Action Required",
              warn: true,
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
            >
              <div className="text-xs font-semibold text-gray-400 uppercase mb-2">
                {s.label}
              </div>
              <div
                className={`text-2xl font-bold ${s.warn ? "text-orange-500" : "text-gray-900"}`}
              >
                {s.value}
              </div>
              <div
                className={`text-xs mt-2 font-medium ${s.warn ? "text-orange-400" : s.up ? "text-green-500" : "text-red-500"}`}
              >
                {s.change}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Queue */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Live Order Queue</h3>

              {/* 2. Updated "View All" button to call onNavigate */}
              <button
                onClick={() => onNavigate("orders")}
                className="text-sm text-sky-500 font-semibold hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-3">Order / Client</th>
                    <th className="px-6 py-3">Specs</th>
                    <th className="px-6 py-3">File</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((o, i) => (
                    <tr
                      key={i}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-800 text-sm">
                          {o.id}
                        </div>
                        <div className="text-xs text-gray-400">{o.client}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-600 mb-1">
                          {o.specs.size}
                        </div>
                        <PriorityTag priority={o.specs.priority} />
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        <div className="flex items-center gap-2">
                          <svg
                            width="16"
                            height="16"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
                            <path d="M13 2v7h7" />
                          </svg>
                          <span className="text-xs">{o.file}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={o.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm self-start">
            <h3 className="font-bold text-gray-800 mb-6">Inventory Levels</h3>
            <div className="space-y-2">
              {inventory.map((item, i) => (
                <InventoryBar key={i} item={item} />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50">
        <button
          onClick={() => onNavigate("dashboard")}
          className="flex flex-col items-center gap-1 text-sky-500"
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
          </svg>
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button
          onClick={() => onNavigate("orders")}
          className="flex flex-col items-center gap-1 text-gray-400"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
          </svg>
          <span className="text-[10px] font-bold">Orders</span>
        </button>
      </div>
    </div>
  );
}
