export type OrderStatus =
  | "Pending"
  | "Printing"
  | "Done"
  | "Cancelled"
  | "In Progress"
  | "Completed";

export type Priority = "High" | "Low" | "Normal";
export type DpiQuality = "High Res" | "Med Res" | "Low Res";

export interface Order {
  id: string;
  client: string;
  status: OrderStatus;
  // Fields for Dashboard
  specs?: { size: string; priority: Priority };
  file?: string;
  filePages?: number;
  // Fields for OrderPage
  previewColor?: string;
  dimensions?: string;
  dpiQuality?: DpiQuality;
}

export interface InventoryItem {
  name: string;
  used: number;
  total: number;
  unit: string;
  low: boolean;
}

// Rename this to NavigationProps so it works for ALL pages
export interface NavigationProps {
  onNavigate: (page: string) => void;
}

// Keep this as an alias in case you used it in OrderPage.tsx
export type OrdersPageProps = NavigationProps;
