import React, { useState, useMemo } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  category: "Materials" | "Equipment" | "Supplies";
  current: number;
  max: number;
  lastRestocked: string;
  cost: number;
  icon: string;
  iconBg: string;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_ITEMS: InventoryItem[] = [
  {
    id: 1,
    name: "PVC Vinyl",
    sku: "MAT-001",
    category: "Materials",
    current: 45,
    max: 100,
    lastRestocked: "2 days ago",
    cost: 8.5,
    icon: "🗒️",
    iconBg: "bg-blue-50",
  },
  {
    id: 2,
    name: "Sticker Roll (Matte)",
    sku: "MAT-002",
    category: "Materials",
    current: 8,
    max: 100,
    lastRestocked: "12 days ago",
    cost: 5.2,
    icon: "🏷️",
    iconBg: "bg-red-50",
  },
  {
    id: 3,
    name: "Mesh Banner",
    sku: "MAT-003",
    category: "Materials",
    current: 72,
    max: 100,
    lastRestocked: "1 week ago",
    cost: 14.0,
    icon: "🖼️",
    iconBg: "bg-green-50",
  },
  {
    id: 5,
    name: "Laminate Film",
    sku: "MAT-005",
    category: "Materials",
    current: 6,
    max: 80,
    lastRestocked: "3 weeks ago",
    cost: 11.0,
    icon: "🧱",
    iconBg: "bg-orange-50",
  },
  {
    id: 6,
    name: "Wide Format Printer",
    sku: "EQP-001",
    category: "Equipment",
    current: 2,
    max: 4,
    lastRestocked: "2 months ago",
    cost: 1200,
    icon: "🖨️",
    iconBg: "bg-sky-50",
  },
  {
    id: 10,
    name: "Transfer Tape",
    sku: "SUP-002",
    category: "Supplies",
    current: 4,
    max: 50,
    lastRestocked: "2 weeks ago",
    cost: 2.8,
    icon: "🎞️",
    iconBg: "bg-orange-50",
  },
];

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_ITEMS);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Materials",
    current: 0,
    max: 100,
    cost: 0,
  });

  // ── Logic ──────────────────────────────────────────────────────────────────

  const getStatus = (current: number, max: number) => {
    const pct = current / max;
    if (pct <= 0.12) return "low";
    if (pct <= 0.35) return "warn";
    return "ok";
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesTab =
        activeTab === "all" || item.category.toLowerCase() === activeTab;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [items, activeTab, searchQuery]);

  const stats = useMemo(() => {
    const lowCount = items.filter(
      (i) => getStatus(i.current, i.max) === "low",
    ).length;
    const okCount = items.filter(
      (i) => getStatus(i.current, i.max) === "ok",
    ).length;
    return { total: items.length, low: lowCount, ok: okCount };
  }, [items]);

  const handleRestock = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, current: item.max, lastRestocked: "Just now" }
          : item,
      ),
    );
  };

  const addItem = () => {
    if (!newItem.name) return;
    const item: InventoryItem = {
      id: Date.now(),
      name: newItem.name,
      sku: `${newItem.category.slice(0, 3).toUpperCase()}-${items.length + 1}`,
      category: newItem.category as any,
      current: newItem.current,
      max: newItem.max,
      lastRestocked: "Just now",
      cost: newItem.cost,
      icon: "📦",
      iconBg: "bg-slate-50",
    };
    setItems([item, ...items]);
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Inventory Management
          </h1>
          <p className="text-slate-500 text-sm">
            Monitor and restock your printing supplies.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search items..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="w-4 h-4 absolute left-3 top-3 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-blue-200"
          >
            <span className="text-lg leading-none">+</span> Add Item
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "Total Items",
            value: stats.total,
            sub: "Across all categories",
            color: "text-slate-800",
          },
          {
            label: "Low Stock",
            value: stats.low,
            sub: "Action required",
            color: "text-red-600",
          },
          {
            label: "Healthy Stock",
            value: stats.ok,
            sub: "Above threshold",
            color: "text-emerald-600",
          },
          {
            label: "Inventory Value",
            value: `$${items.reduce((acc, curr) => acc + curr.cost * curr.current, 0).toLocaleString()}`,
            sub: "Total asset value",
            color: "text-blue-600",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
          >
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            <p className={`text-3xl font-black ${stat.color} tracking-tighter`}>
              {stat.value}
            </p>
            <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100/50 p-1 rounded-xl w-fit mb-6">
        {["all", "materials", "equipment", "supplies"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Item Details
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Category
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Status
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Stock Level
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredItems.map((item) => {
              const status = getStatus(item.current, item.max);
              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center text-lg`}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">
                          {item.name}
                        </p>
                        <p className="text-[10px] font-mono text-slate-400">
                          {item.sku}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {item.category}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                      ${status === "low" ? "bg-red-50 text-red-600" : status === "warn" ? "bg-orange-50 text-orange-600" : "bg-emerald-50 text-emerald-600"}`}
                    >
                      {status === "low"
                        ? "⚠ Urgent"
                        : status === "warn"
                          ? "↓ Low"
                          : "✓ Healthy"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-40">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                        <span>
                          {item.current} / {item.max}
                        </span>
                        <span>
                          {Math.round((item.current / item.max) * 100)}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${status === "low" ? "bg-red-500" : status === "warn" ? "bg-orange-500" : "bg-emerald-500"}`}
                          style={{
                            width: `${(item.current / item.max) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleRestock(item.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all
                        ${status === "low" ? "bg-red-600 text-white hover:bg-red-700" : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"}`}
                    >
                      Restock
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Simple Modal Implementation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Add New Item
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Enter the details to add to your stock.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Matte Vinyl"
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Current
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm"
                    onChange={(e) =>
                      setNewItem({ ...newItem, current: +e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Max
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm"
                    onChange={(e) =>
                      setNewItem({ ...newItem, max: +e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addItem}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200"
              >
                Save Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
