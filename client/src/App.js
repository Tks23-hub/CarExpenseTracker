import React, { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import LogHistory from "./components/LogHistory";
import "./App.css";

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

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="container">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Welcome, {user.username}!</h2>
        <nav>
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
        </nav>
      </header>

      {viewHistory ? <LogHistory /> : <Dashboard />}
    </div>
  );
}

export default App;
