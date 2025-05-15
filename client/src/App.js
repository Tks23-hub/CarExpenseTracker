import React, { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import LogHistory from "./components/LogHistory";
import Signup from "./components/Signup";
import Stats from "./components/Stats";

import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("dashboard");
  const [showSignup, setShowSignup] = useState(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setView("dashboard");
  };

  if (!user) {
    return showSignup ? (
      <Signup
        onSignupSuccess={handleLoginSuccess}
        onSwitchToLogin={() => setShowSignup(false)}
      />
    ) : (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onSwitchToSignup={() => setShowSignup(true)}
      />
    );
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
          <button
            onClick={() => setView("dashboard")}
            disabled={view === "dashboard"}
          >
            Dashboard
          </button>
          <button
            onClick={() => setView("history")}
            disabled={view === "history"}
          >
            View Log History
          </button>
          <button onClick={() => setView("stats")} disabled={view === "stats"}>
            View Stats
          </button>
          <button onClick={handleLogout} style={{ marginLeft: "16px" }}>
            Logout
          </button>
        </nav>
      </header>

      {view === "dashboard" && <Dashboard />}
      {view === "history" && <LogHistory />}
      {view === "stats" && <Stats />}
    </div>
  );
}

export default App;
