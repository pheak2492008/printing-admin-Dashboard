import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import OrderPage from "./pages/Orders/OrderPage";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Determine which tab is active based on the URL path
  const currentActive =
    location.pathname === "/"
      ? "dashboard"
      : location.pathname.replace("/", "");

  // 2. Function to change the URL when a sidebar item is clicked
  const handleNavigation = (key: string) => {
    if (key === "dashboard") {
      navigate("/");
    } else {
      navigate(`/${key}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 3. Sidebar - Now receiving the required props to fix the error */}
      <Navbar activeItem={currentActive} onNavigate={handleNavigation} />

      {/* 4. Main Content Area */}
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
          {/* You can add /inventory or /profile routes here later */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
