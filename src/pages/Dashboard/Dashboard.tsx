import React, { useState, useEffect } from "react";
import { InventoryBar } from "../../components/Dashboard/InventoryBar";
import { StatusBadge } from "../../components/Dashboard/StatusBadge";
import { Link } from "react-router-dom";
import AddProductModal from "../../components/Dashboard/AddProductModal";

const BASE_URL = "http://localhost:8081/api/v1";

export default function Dashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeOrders: 0,
    lowStockCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordRes, invRes] = await Promise.all([
          fetch(`${BASE_URL}/orders/getall`),
          fetch(`${BASE_URL}/inventory`), // Path confirmed in image_d213a2
        ]);

        const orderData = ordRes.ok ? await ordRes.json() : [];
        const invData = invRes.ok ? await invRes.json() : [];

        // Correct field mapping for Inventory
        const lowStock = invData.filter(
          (item: any) => (item.remainingStockM2 || 0) < 20,
        ).length;
        const revenue = orderData.reduce(
          (sum: number, o: any) => sum + (o.totalPrice || 0),
          0,
        );

        setOrders(orderData.slice(0, 5));
        setInventory(invData);
        setStats({
          totalRevenue: revenue,
          activeOrders: orderData.filter((o: any) => o.status !== "COMPLETED")
            .length,
          lowStockCount: lowStock,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen font-black text-gray-300 italic animate-pulse">
        LOADING DATA...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
            <p className="text-sm text-gray-500">
              Real-time shop performance monitoring.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg transition-transform hover:scale-105"
          >
            + Post Product
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            label="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            color="text-gray-900"
          />
          <StatCard
            label="Active Orders"
            value={stats.activeOrders.toString()}
            color="text-blue-600"
          />
          <StatCard
            label="Low Stock"
            value={`${stats.lowStockCount} Items`}
            color={
              stats.lowStockCount > 0 ? "text-orange-500" : "text-gray-900"
            }
            isWarn={stats.lowStockCount > 0}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-6">Live Order Queue</h3>
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <th className="pb-4">Client</th>
                  <th className="pb-4">Dimensions</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((o) => (
                  <tr key={o.orderId} className="hover:bg-gray-50">
                    <td className="py-4 font-bold text-sm text-gray-800">
                      {o.customerName}
                    </td>
                    <td className="py-4 text-xs text-gray-600">
                      {o.width}m x {o.length}m
                    </td>
                    <td className="py-4">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6">Inventory</h3>
            <div className="space-y-6">
              {inventory.map((item, i) => (
                <InventoryBar
                  key={i}
                  item={{
                    name: item.materialName,
                    used: item.remainingStockM2, // Fix for image_d213a2
                    total: item.totalStockM2,
                    unit: "m",
                    low: item.remainingStockM2 < 20,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </main>
    </div>
  );
}

const StatCard = ({ label, value, color, isWarn }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <div className="text-xs font-bold text-gray-400 uppercase">{label}</div>
    <div className={`text-3xl font-black mt-1 ${color}`}>{value}</div>
    {isWarn && (
      <div className="text-[10px] mt-2 text-orange-400 font-bold">
        ⚠️ RESTOCK REQUIRED
      </div>
    )}
  </div>
);
