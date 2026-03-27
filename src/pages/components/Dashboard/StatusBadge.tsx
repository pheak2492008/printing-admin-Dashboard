// Use 'import type' to satisfy TypeScript's verbatimModuleSyntax
import type { OrderStatus } from "../../../types/dashboard";

export const StatusBadge = ({ status }: { status: OrderStatus }) => {
  // TypeScript requires ALL keys from OrderStatus to be present here
  const styles: Record<OrderStatus, string> = {
    Pending: "bg-blue-100 text-blue-600",
    Printing: "bg-green-100 text-green-600",
    Done: "bg-gray-100 text-gray-500",
    Cancelled: "bg-red-100 text-red-500",
    // Added these to fix the error:
    "In Progress": "bg-blue-100 text-blue-700",
    Completed: "bg-emerald-100 text-emerald-700",
  };

  return (
    <span
      className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full transition-colors ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
};
