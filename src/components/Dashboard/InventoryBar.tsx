import type { InventoryItem } from "../../types/dashboard";

export const InventoryBar = ({ item }: { item: InventoryItem }) => {
  const pct = (item.used / item.total) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{item.name}</span>
        <span className="text-xs text-gray-400">
          {item.used}m / {item.unit}
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-700 ease-in-out ${
            item.low ? "bg-red-400" : "bg-sky-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
