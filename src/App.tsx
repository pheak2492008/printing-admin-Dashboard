import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import OrderPage from "./pages/Orders/OrderPage";
import InventoryPage from "./pages/Inventory/inventory";
import ReportPage from "./pages/Report/report";
import ProfilePage from "./pages/ProfileAdmin/profile";
import Login from "./pages/Authentication/login";
import type { JSX } from "react";

// ── PROTECTED ROUTE COMPONENT ────────────────────────────────
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

function App() {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";

  // Hide Navbar if on login page or if not authenticated
  const isLoginPage = location.pathname === "/login";
  const showNavbar = isAuthenticated && !isLoginPage;

  return (
    <div className="flex min-h-screen bg-slate-50 selección:bg-blue-100">
      {/* Change: Only show Navbar if authenticated and not on login page */}
      {showNavbar && <Navbar />}

      <main className="flex-1 overflow-autopb-24">
        <Routes>
          {/* Public Route */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard onNavigate={() => {}} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <InventoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ReportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
