import React, { useEffect, useState } from "react";
import axios from "axios";

function LogHistory() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [editingLogId, setEditingLogId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const token = localStorage.getItem("token");

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/logs/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch log history");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [token]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (logId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/logs/edit/${logId}`,
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditingLogId(null);
      fetchLogs(); // refresh logs
    } catch (err) {
      setError("Failed to update log");
    }
  };

  const handleDelete = async (logId) => {
    if (!window.confirm("Are you sure you want to delete this log?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/logs/delete/${logId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLogs();
    } catch (err) {
      setError("Failed to delete log");
    }
  };

  return (
    <div>
      <div className="log-history-container"></div>
      <h2>All Log History</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {logs.length === 0 && !error && <p>You have no logs yet.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {logs.map((log) => (
          <li key={log.id} className="log-entry">
            <strong>
              {log.car_type} {log.car_model}
            </strong>{" "}
            | <em>{log.log_type}</em> —{" "}
            {editingLogId === log.id ? (
              <>
                <input
                  type="text"
                  name="description"
                  value={editForm.description || ""}
                  onChange={handleEditChange}
                  placeholder="Description"
                />
                <input
                  type="number"
                  name="cost"
                  value={editForm.cost || ""}
                  onChange={handleEditChange}
                  placeholder="Cost"
                />
                <select
                  name="log_type"
                  value={editForm.log_type || ""}
                  onChange={handleEditChange}
                >
                  <option value="gas">Gas</option>
                  <option value="repair">Repair</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="tires">Tires</option>
                  <option value="water">Water</option>
                </select>
                <button onClick={() => handleEditSubmit(log.id)}>
                  💾 Save
                </button>
                <button onClick={() => setEditingLogId(null)}>Cancel</button>
              </>
            ) : (
              <>
                {log.description} | Cost: ${log.cost} |{" "}
                {new Date(log.log_date).toLocaleString()}
                <button
                  onClick={() => {
                    setEditingLogId(log.id);
                    setEditForm({
                      log_type: log.log_type,
                      description: log.description,
                      cost: log.cost,
                    });
                  }}
                >
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(log.id)}>🗑️ Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LogHistory;
