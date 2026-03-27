import { InventoryBar } from "../components/Dashboard/InventoryBar";
import { StatusBadge } from "../components/Dashboard/StatusBadge"; // Make sure this is imported
import type { Order, InventoryItem } from "../../types/dashboard";

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
    filePages: 1,
    status: "Done",
  },
];

const inventory: InventoryItem[] = [
  { name: "PVC Matte", used: 45, total: 100, unit: "100m", low: false },
  { name: "Vinyl Sticker", used: 85, total: 100, unit: "100m", low: true },
  { name: "Mesh Fabric", used: 72, total: 100, unit: "100m", low: false },
];

export default function Dashboard({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white border-r border-gray-100 p-6 flex flex-col">
        <div className="mb-10">
          <h1 className="font-bold text-xl text-blue-600">PrintQueue Pro</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">
            Admin Panel
          </p>
        </div>

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => onNavigate("dashboard")}
            className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl transition-all"
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate("orders")}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition-all"
          >
            Orders
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
            Inventory
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full overflow-auto">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
          <p className="text-sm text-gray-500">
            Welcome back! Here's what's happening today.
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Revenue" value="$1,240" change="+12%" />
          <StatCard label="Active Orders" value="12" change="+5%" />
          <StatCard label="Completion" value="94%" change="+2%" />
          <StatCard
            label="Low Stock"
            value="2 Items"
            change="Action Req"
            isWarn
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Table Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800">Live Order Queue</h3>
              <button
                onClick={() => onNavigate("orders")}
                className="text-sm text-blue-500 font-semibold hover:underline"
              >
                View All
              </button>
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
                    key={order.id}
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4">
                      <div className="font-bold text-sm text-gray-800">
                        {order.id}
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.client}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="text-xs text-gray-600">
                        {order.specs?.size}
                      </div>
                      <div
                        className={`text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded w-fit ${
                          order.specs?.priority === "High"
                            ? "bg-red-50 text-red-500"
                            : order.specs?.priority === "Low"
                              ? "bg-yellow-50 text-yellow-600"
                              : "bg-gray-50 text-gray-500"
                        }`}
                      >
                        {order.specs?.priority}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 group-hover:text-blue-500 transition-colors">
                        <span className="opacity-50">📄</span> {order.file}
                      </div>
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
                <InventoryBar key={i} item={item} />
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
