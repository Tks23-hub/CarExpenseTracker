import React, { useEffect, useState } from "react";
import axios from "axios";

function LogHistory() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHistory = async () => {
      console.log("📡 Requesting logs from /api/logs/all");
      try {
        const res = await axios.get("http://localhost:5000/api/logs/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch log history");
      }
    };
    fetchHistory();
  }, [token]);

  return (
    <div>
      <h2>All Log History</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {logs.length === 0 && !error && <p>You have no logs yet.</p>}
      <ul>
        {logs.map((log) => (
          <li key={log.id}>
            <strong>
              {log.car_type} {log.car_model}
            </strong>{" "}
            | <em>{log.log_type}</em> — {log.description} | Cost: ${log.cost} |{" "}
            {new Date(log.log_date).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LogHistory;
