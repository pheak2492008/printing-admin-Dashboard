<<<<<<< HEAD
import { InventoryBar } from "../../components/Dashboard/InventoryBar";
import { StatusBadge } from "../../components/Dashboard/StatusBadge"; // Make sure this is imported
=======
import React, { useState, useEffect } from "react";
import { InventoryBar } from "../../components/Dashboard/InventoryBar";
import { StatusBadge } from "../../components/Dashboard/StatusBadge";
>>>>>>> staging
import type { Order, InventoryItem } from "../../types/dashboard";
import { Link } from "react-router-dom";

// --- API Configuration ---
const BASE_URL = "http://localhost:8081/api";

export default function Dashboard({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const [orders, setOrders] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeOrders: 0,
    lowStockCount: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Orders from /api/orders/getall
        const orderRes = await fetch(`${BASE_URL}/orders/getall`);
        const orderData = await orderRes.json();

        // 2. Fetch Materials from /api/materials/getall
        const matRes = await fetch(`${BASE_URL}/materials/getall`);
        const matData = await matRes.json();

        // --- CALCULATE STATISTICS ---
        const revenue = orderData.reduce(
          (sum: number, item: any) => sum + item.totalPrice,
          0,
        );
        const active = orderData.filter(
          (item: any) => item.status !== "COMPLETED",
        ).length;
        const lowStock = matData.filter(
          (item: any) => item.currentStock < 20,
        ).length;

        setOrders(orderData.slice(0, 5)); // Show only latest 5 in the "Live Queue"
        setInventory(matData);
        setStats({
          totalRevenue: revenue,
          activeOrders: active,
          lowStockCount: lowStock,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen font-black text-slate-400 italic animate-pulse">
        SYNCING DASHBOARD DATA...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full overflow-auto">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
          <p className="text-sm text-gray-500">
            Welcome back! Here's what's happening today.
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            change="+12%"
          />
          <StatCard
            label="Active Orders"
            value={stats.activeOrders.toString()}
            change="+5%"
          />
          <StatCard label="Completion" value="94%" change="+2%" />
          <StatCard
            label="Low Stock"
            value={`${stats.lowStockCount} Items`}
            change="Action Req"
            isWarn={stats.lowStockCount > 0}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Table Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800">Live Order Queue</h3>
              <Link
                to="/orders"
                className="text-sm text-blue-500 font-semibold hover:underline"
              >
                View All
              </Link>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <th className="pb-4">Order / Client</th>
                  <th className="pb-4">Specs</th>
                  <th className="pb-4">File</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4">
                      <div className="font-bold text-sm text-gray-800">
                        #{order.orderId}
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.customerName}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="text-xs text-gray-600">
                        {order.width}m x {order.length}m
                      </div>
                      <div className="text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded w-fit bg-slate-100 text-slate-500 uppercase">
                        {order.dpiQuality || "Standard"}
                      </div>
                    </td>
                    <td className="py-4">
                      {/* Interactive File Link */}
                      <button
                        onClick={() =>
                          window.open(
                            `http://localhost:8081${order.designFileUrl}`,
                          )
                        }
                        className="flex items-center gap-2 group/file text-left"
                      >
                        <div className="p-1.5 bg-slate-50 rounded group-hover/file:bg-blue-50 transition-colors">
                          {order.designFileUrl?.match(/\.(jpg|jpeg|png|gif)$/i)
                            ? "🖼️"
                            : "📄"}
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 group-hover/file:text-blue-600 truncate max-w-[100px]">
                          {order.designFileUrl?.split("_").pop() || "View"}
                        </span>
                      </button>
                    </td>
                    <td className="py-4">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Inventory Section */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6">Inventory Levels</h3>
            <div className="space-y-6">
              {inventory.map((item, i) => (
                <InventoryBar
                  key={i}
                  item={{
                    name: item.materialName,
                    used: item.currentStock, // Assumes backend provides stock
                    total: 100, // Static baseline
                    unit: "m",
                    low: item.currentStock < 20,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const StatCard = ({ label, value, change, isWarn }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
    <div className="text-xs font-semibold text-gray-400 uppercase tracking-tight">
      {label}
    </div>
    <div
      className={`text-2xl font-bold mt-1 ${isWarn ? "text-orange-500" : "text-gray-900"}`}
    >
      {value}
    </div>
    <div
      className={`text-xs mt-2 flex items-center gap-1 ${isWarn ? "text-orange-400" : "text-green-500"}`}
    >
      {isWarn && <span>⚠️</span>} {change}
    </div>
  </div>
);
