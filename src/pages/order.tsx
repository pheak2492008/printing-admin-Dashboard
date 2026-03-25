"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, Trash2 } from "lucide-react";

interface Order {
  id: string;
  client: string;
  previewColor: string;
  dimensions: string;
  dpiQuality: "High Res" | "Med Res" | "Low Res";
  status: "Pending" | "In Progress" | "Completed";
}

const initialOrders: Order[] = [
  {
    id: "#8293",
    client: "John Doe",
    previewColor: "bg-gray-200",
    dimensions: "2m x 5m",
    dpiQuality: "High Res",
    status: "In Progress",
  },
  {
    id: "#8294",
    client: "Sarah Miller",
    previewColor: "bg-gray-200",
    dimensions: "1.5m x 1.5m",
    dpiQuality: "Low Res",
    status: "Pending",
  },
  {
    id: "#8295",
    client: "Tech Solutions Inc",
    previewColor: "bg-sky-200",
    dimensions: "10m x 2m",
    dpiQuality: "High Res",
    status: "Completed",
  },
  {
    id: "#8296",
    client: "Coffee Haven",
    previewColor: "bg-emerald-100",
    dimensions: "0.6m x 1.8m",
    dpiQuality: "High Res",
    status: "Pending",
  },
  {
    id: "#8297",
    client: "Urban Print",
    previewColor: "bg-yellow-200",
    dimensions: "3m x 1m",
    dpiQuality: "Med Res",
    status: "In Progress",
  },
  {
    id: "#8298",
    client: "Bright Media",
    previewColor: "bg-purple-200",
    dimensions: "5m x 3m",
    dpiQuality: "High Res",
    status: "Completed",
  },
];

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-emerald-100 text-emerald-700",
};

const qualityColors = {
  "High Res": "bg-purple-100 text-purple-700",
  "Med Res": "bg-cyan-100 text-cyan-700",
  "Low Res": "bg-gray-100 text-gray-700",
};

export default function OrdersPage() {
  const [orders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<
    "All" | "Pending" | "In Progress" | "Completed"
  >("All");

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Filter by search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (order) =>
          order.client.toLowerCase().includes(term) ||
          order.id.toLowerCase().includes(term),
      );
    }

    // Filter by tab
    if (activeTab !== "All") {
      result = result.filter((order) => order.status === activeTab);
    }

    return result;
  }, [orders, searchTerm, activeTab]);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    inProgress: orders.filter((o) => o.status === "In Progress").length,
    completed: orders.filter((o) => o.status === "Completed").length,
  };

  const handleDelete = (id: string) => {
    // In real app, you would call API here
    alert(`Delete order ${id}`);
  };

  const getStatusBadge = (status: Order["status"]) => (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
    >
      {status}
    </span>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="hidden sm:block">
          <h1 className="text-sm font-bold text-gray-900 leading-tight">
            PrintQueue Pro
          </h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
            Admin Panel
          </p>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 font-medium rounded-xl"
            >
              Orders
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl"
            >
              Inventory
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl"
            >
              Reports
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl"
            >
              Profile
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b bg-white px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900">Orders</h2>
              <p className="text-gray-500 mt-1">{stats.total} total orders</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-80">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search orders or clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-transparent focus:border-blue-300 rounded-2xl focus:outline-none"
                />
              </div>

              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium transition-colors">
                <Plus size={20} />
                New Order
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 p-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-4xl font-semibold mt-2">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-3xl shadow-sm">
            <p className="text-sm text-yellow-600">Pending</p>
            <p className="text-4xl font-semibold mt-2 text-yellow-700">
              {stats.pending}
            </p>
          </div>
          <div className="bg-blue-50 p-6 rounded-3xl shadow-sm">
            <p className="text-sm text-blue-600">In Progress</p>
            <p className="text-4xl font-semibold mt-2 text-blue-700">
              {stats.inProgress}
            </p>
          </div>
          <div className="bg-emerald-50 p-6 rounded-3xl shadow-sm">
            <p className="text-sm text-emerald-600">Completed</p>
            <p className="text-4xl font-semibold mt-2 text-emerald-700">
              {stats.completed}
            </p>
          </div>
        </div>

        {/* Tabs & Table */}
        <div className="flex-1 px-8 pb-8 overflow-auto">
          <div className="flex gap-2 mb-6">
            {(["All", "Pending", "In Progress", "Completed"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-2xl font-medium transition-all ${
                    activeTab === tab
                      ? "bg-blue-600 text-white shadow"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab}{" "}
                  {tab !== "All" && (
                    <span className="text-xs opacity-75">
                      ({stats[tab.toLowerCase() as keyof typeof stats] || 0})
                    </span>
                  )}
                </button>
              ),
            )}
          </div>

          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                    ORDER ID
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                    CLIENT
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                    PREVIEW
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                    DIMENSIONS
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                    DPI QUALITY
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                    STATUS
                  </th>
                  <th className="px-8 py-5 text-right text-sm font-semibold text-gray-600">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-8 py-6 font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-8 py-6 text-gray-700">{order.client}</td>

                    <td className="px-8 py-6">
                      <div
                        className={`w-10 h-10 rounded-xl ${order.previewColor} flex items-center justify-center text-xs text-gray-400`}
                      >
                        IMG
                      </div>
                    </td>

                    <td className="px-8 py-6 text-gray-600 font-medium">
                      {order.dimensions}
                    </td>

                    <td className="px-8 py-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${qualityColors[order.dpiQuality]}`}
                      >
                        {order.dpiQuality}
                      </span>
                    </td>

                    <td className="px-8 py-6">
                      {getStatusBadge(order.status)}
                    </td>

                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="inline-flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
                      >
                        <Trash2 size={18} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                No orders found matching your criteria.
              </div>
            )}
          </div>

          <div className="text-right text-sm text-gray-500 mt-4">
            {filteredOrders.length} results
          </div>
        </div>
      </div>
    </div>
  );
}
