import React, { useState } from "react";
import axios from "axios";

function Signup({ onSignupSuccess, onSwitchToLogin }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );
      const loginRes = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          username: form.username,
          password: form.password,
        }
      );

      const { token, user } = loginRes.data;
      localStorage.setItem("token", token);
      onSignupSuccess(user);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">Sign Up</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          style={{
            border: "none",
            background: "none",
            color: "#007bff",
            cursor: "pointer",
          }}
        >
          Log in here
        </button>
      </p>
    </div>
  );
}

export default Signup;
