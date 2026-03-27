import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import type {
  Order,
  OrdersPageProps,
  OrderStatus,
} from "../../types/dashboard";
import { OrderRow } from "../components/Orders/OrderRow";

// Move initial data out to a separate mock file later
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
];

export default function OrderPage({ onNavigate }: OrdersPageProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<OrderStatus | "All">("All");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === "All" || order.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [orders, searchTerm, activeTab]);

  const handleDelete = (id: string) => {
    if (window.confirm(`Delete order ${id}?`)) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Reuse your Sidebar component here later */}
      <aside className="w-64 bg-white border-r hidden lg:flex flex-col p-6">
        <h1 className="font-bold text-xl mb-8">PrintQueue Pro</h1>
        <nav className="space-y-2">
          <button
            onClick={() => onNavigate("dashboard")}
            className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100"
          >
            Dashboard
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl bg-blue-50 text-blue-600 font-bold">
            Orders
          </button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Orders</h2>
            <p className="text-gray-500">{orders.length} total orders</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 ring-blue-500/20 w-64"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium hover:bg-blue-700 transition-colors">
              <Plus size={20} /> New Order
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {["All", "Pending", "In Progress", "Completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-white text-gray-500 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase">
                    Order ID
                  </th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase">
                    Client
                  </th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase">
                    Preview
                  </th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase">
                    Dimensions
                  </th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase">
                    DPI
                  </th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-8 py-4 text-right text-xs font-bold text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
            {filteredOrders.length === 0 && (
              <div className="p-20 text-center text-gray-400">
                No matching orders found.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
