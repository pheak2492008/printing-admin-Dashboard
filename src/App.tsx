import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar/navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import OrderPage from "./pages/Orders/OrderPage";
import InventoryPage from "./pages/Inventory/inventory";
import ReportPage from "./pages/Reviwe/reviwe";
import ProfilePage from "./pages/ProfileAdmin/profile";
import Login from "./pages/Authentication/login";
import type { JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

function App() {
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isLoggedIn") === "true",
  );

  // Re-check auth when route changes
  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("isLoggedIn") === "true");
  }, [location]);

  const isLoginPage = location.pathname === "/login";
  const showNavbar = isAuthenticated && !isLoginPage;

  return (
    <div className="flex min-h-screen bg-slate-50 selection:bg-blue-100 font-sans">
      {showNavbar && <Navbar />}

      <main className={`flex-1 ${showNavbar ? "overflow-auto" : ""}`}>
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
          />

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
            path="/reviews"
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
