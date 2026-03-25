import { useState } from "react";
import PrintQueueDashboard from "../src/pages/PrintQueueDashboard";
import  OrdersPage  from "../src/pages/order";

import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <div className="app-container">
      {/* We pass 'setCurrentPage' as a prop named 'onNavigate' 
         so the Dashboard can call it.
      */}
      {currentPage === "dashboard" ? (
        <PrintQueueDashboard onNavigate={setCurrentPage} />
      ) : (
        <OrdersPage onNavigate={setCurrentPage} />
      )}
    </div>
  );
}
export default App;
