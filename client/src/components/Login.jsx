import React, { useState } from "react";
import axios from "axios";

function Login({ onLoginSuccess, onSwitchToSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      const { token, user } = res.data;
      // Save token to localStorage
      localStorage.setItem("token", token);

      onLoginSuccess(user); // Notify App
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button type="submit">Login</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p>
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            style={{
              border: "none",
              background: "none",
              color: "#007bff",
              cursor: "pointer",
            }}
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
