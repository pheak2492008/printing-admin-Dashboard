export interface LiveOrderResponse {
  id: number;
  clientName: string; // Matches Java private String clientName
  status: string; // Matches Java private String status
}

export interface InventoryLevelResponse {
  name: string; // Matches Java private String name
  level: number; // Matches Java private int level
}

export interface DashboardData {
  totalRevenue: number;
  totalRevenueChangePercent: number;
  activeOrders: number;
  activeOrdersChangePercent: number;
  completionRate: number;
  completionRateChangePercent: number;
  lowStockItems: number;
  liveOrders: LiveOrderResponse[]; // Matches Java List<LiveOrderResponse>
  inventoryLevels: InventoryLevelResponse[]; // Matches Java List<InventoryLevelResponse>
}

export const fetchDashboardData = async (): Promise<DashboardData> => {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch("http://localhost:8081/api/admin/dashboard", {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("Access Denied (403): Check Token or CORS Config.");
      }
      throw new Error(`Server Error ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Fetch failed:", err);
    throw err;
  }
};
