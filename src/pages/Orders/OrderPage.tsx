import React, { useState, useEffect, useCallback } from "react";
import { ExternalLink, Trash2, Printer, MessageSquare } from "lucide-react"; // Added MessageSquare icon

interface Order {
  orderId: number;
  customerName: string;
  phoneNumber: string;
  width: number;
  length: number;
  totalPrice: number;
  status: "PENDING" | "PRINTING" | "COMPLETED";
  designFileUrl: string;
  description?: string; // ✅ 1. ADDED TO INTERFACE
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
          {["All", "PENDING", "PRINTING", "COMPLETED"].map((tab) => (
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

                    {/* ✅ 2. DISPLAY DESCRIPTION IF IT EXISTS */}
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
                      <button className="p-2 text-slate-300 hover:text-red-500 transition-all">
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
      </div>
    </div>
  );
}
