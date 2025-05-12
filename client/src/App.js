import React, { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <div>
      {!user ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2>Welcome, {user.username}!</h2>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <Dashboard />
        </>
      )}
    </div>
  );
}

export default App;
