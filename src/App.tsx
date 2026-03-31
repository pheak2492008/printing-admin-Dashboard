import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import OrderPage from "./pages/Orders/OrderPage";
import InventoryPage from "./pages/Inventory/inventory";
import ReportPage from "./pages/Report/report";
import ProfilePage from "./pages/ProfileAdmin/profile";
function App() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 1. Navbar no longer needs props because it uses NavLink internally */}
      <Navbar />

      {/* 2. Main Content Area */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                onNavigate={function (page: string): void {
                  throw new Error("Function not implemented.");
                }}
              />
            }
          />
          <Route path="/orders" element={<OrderPage />} />
          <Route path="/reports" element={<ReportPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/login"
            element={<div className="p-8">Login Page</div>}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
