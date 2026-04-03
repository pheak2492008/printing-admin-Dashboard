import { Trash2 } from "lucide-react";
// Import type explicitly
import type { Order, DpiQuality } from "../../types/dashboard";

interface OrderRowProps {
  order: Order;
  onDelete: (id: string) => void;
}

// Ensure these records cover the base types to avoid indexing issues
const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Printing: "bg-purple-100 text-purple-700",
  Done: "bg-gray-100 text-gray-500",
  Cancelled: "bg-red-100 text-red-500",
};

const qualityColors: Record<DpiQuality, string> = {
  "High Res": "bg-purple-100 text-purple-700",
  "Med Res": "bg-cyan-100 text-cyan-700",
  "Low Res": "bg-gray-100 text-gray-700",
};

export const OrderRow = ({ order, onDelete }: OrderRowProps) => {
  // 1. Handle potential undefined values safely
  const currentStatus = order.status;
  const currentQuality = order.dpiQuality;
  const currentPreview = order.previewColor || "bg-gray-200"; // Fallback color

  return (
    <tr className="hover:bg-gray-50 transition-colors border-b last:border-0">
      <td className="px-8 py-6 font-medium text-gray-900">{order.id}</td>
      <td className="px-8 py-6 text-gray-700">{order.client}</td>

      <td className="px-8 py-6">
        <div
          className={`w-10 h-10 rounded-xl ${currentPreview} flex items-center justify-center text-[10px] text-gray-400 font-bold`}
        >
          IMG
        </div>
      </td>

      <td className="px-8 py-6 text-gray-600 font-medium">
        {order.dimensions || "N/A"}
      </td>

      <td className="px-8 py-6">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            currentQuality
              ? qualityColors[currentQuality]
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {currentQuality || "Standard"}
        </span>
      </td>

      <td className="px-8 py-6">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusColors[currentStatus] || "bg-gray-100 text-gray-400"
          }`}
        >
          {currentStatus}
        </span>
      </td>

      <td className="px-8 py-6 text-right">
        <button
          onClick={() => onDelete(order.id)}
          className="inline-flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
        >
          <Trash2 size={18} />
          <span className="hidden lg:inline">Delete</span>
        </button>
      </td>
    </tr>
  );
};
