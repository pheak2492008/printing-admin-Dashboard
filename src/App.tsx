import { useState } from "react";
// Go into pages, then the specific folder, then the file
import Dashboard from "./pages/Dashboard/Dashboard";
import OrderPage from "./pages/Orders/OrderPage";

import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <div className="app-container">
      {currentPage === "dashboard" ? (
        <Dashboard onNavigate={setCurrentPage} />
      ) : (
        <OrderPage onNavigate={setCurrentPage} />
      )}
    </div>
  );
}

export default App;
