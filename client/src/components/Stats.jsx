import React, { useEffect, useState } from "react";
import axios from "axios";

function Stats() {
  const [stats, setStats] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/logs/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("📡 Stats received from backend:", res.data);
        setStats(res.data);
      } catch (err) {
        setError("Failed to fetch stats");
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div>
      <h2>Spending Stats</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {stats.length === 0 ? (
        <p>No spending data yet.</p>
      ) : (
        <ul>
          {stats.map((item, idx) => (
            <li key={idx}>
              {item.car_id ? (
                <>
                  🚗{" "}
                  <strong>
                    {item.car_type} {item.car_model}
                  </strong>{" "}
                  — ${Number(item.total_spent || 0).toFixed(2)}
                </>
              ) : (
                <>
                  🛠 <strong>{item.car_type}</strong> — $
                  {Number(item.total_spent || 0).toFixed(2)}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Stats;
