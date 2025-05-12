import React, { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import LogHistory from "./components/LogHistory";

function App() {
  const [user, setUser] = useState(null);
  const [viewHistory, setViewHistory] = useState(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setViewHistory(false);
  };
  console.log("👁 View mode:", viewHistory ? "LogHistory" : "Dashboard");

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Welcome, {user.username}!</h2>
        <div>
          <button onClick={() => setViewHistory(false)} disabled={!viewHistory}>
            Dashboard
          </button>
          <button
            onClick={() => setViewHistory(true)}
            disabled={viewHistory}
            style={{ marginLeft: "8px" }}
          >
            View Log History
          </button>
          <button onClick={handleLogout} style={{ marginLeft: "16px" }}>
            Logout
          </button>
        </div>
      </div>

      {viewHistory ? <LogHistory /> : <Dashboard />}
    </div>
  );
}

export default App;
