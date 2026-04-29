import { Loader2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

// --- Types ---
interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  category: string;
  current: number; // currentStock
  max: number; // maxStock
  cost: number; // pricePerM2
}

// Ensure this matches your running Spring Boot port
const API_BASE = "http://localhost:8082/api/materials";

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- 1. Fetch from material-controller ---
  const fetchInventory = async () => {
    setLoading(true);
    try {
      // Endpoint from your Swagger UI
      const response = await fetch(`${API_BASE}/getall`);
      if (response.ok) {
        const data = await response.json();

        // Mapping backend JSON to our Interface
        const mappedData = data.map((item: any) => ({
          id: item.id || item.materialId,
          name: item.name, // From your Swagger response
          sku: `MAT-00${item.id || item.materialId}`,
          category: "Materials",
          current: item.currentStock || 45, // Replace with inventory-controller data if separate
          max: item.maxStock || 100,
          cost: item.pricePerM2 || 0, // From your Swagger response
        }));
        setItems(mappedData);
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // --- 2. Add Item Logic ---
  const handleAddItem = async (newItemData: any) => {
    try {
      const response = await fetch(`${API_BASE}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newItemData.name,
          pricePerM2: newItemData.cost,
          description: "New stock item",
        }),
      });
      if (response.ok) {
        fetchInventory(); // Refresh list after adding
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  // --- Logic & Stats ---
  const stats = useMemo(() => {
    const low = items.filter((i) => i.current / i.max <= 0.15).length;
    const totalVal = items.reduce(
      (acc, curr) => acc + curr.cost * curr.current,
      0,
    );
    return {
      total: items.length,
      low,
      healthy: items.length - low,
      value: totalVal,
    };
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [items, searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-slate-400">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p className="text-xs font-bold uppercase tracking-widest">
          Fetching Materials...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Inventory Management
          </h1>
          <p className="text-slate-500 text-sm">
            Monitor and restock your printing supplies.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all"
        >
          + Add Item
        </button>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Items"
          value={stats.total}
          color="text-slate-800"
        />
        <StatCard
          label="Healthy Stock"
          value={stats.healthy}
          color="text-emerald-600"
        />
        <StatCard
          label="Inventory Value"
          value={`$${stats.value.toLocaleString()}`}
          color="text-blue-600"
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">
                Item Details
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">
                Status
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">
                Stock Level
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredItems.map((item) => {
              const isLow = item.current / item.max <= 0.15;
              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-700">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {item.sku}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold ${isLow ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}
                    >
                      {isLow ? "⚠ URGENT" : "✓ HEALTHY"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-40 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${isLow ? "bg-red-500" : "bg-emerald-500"}`}
                        style={{ width: `${(item.current / item.max) * 100}%` }}
                      />
                    </div>
                    <div className="text-[10px] mt-1 text-slate-400">
                      {item.current} / {item.max}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                      Restock
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
        {label}
      </p>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
    </div>
  );
}
