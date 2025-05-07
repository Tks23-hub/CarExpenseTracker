const db = require("../db");

// Function to add a log entry
const addLog = (req, res) => {
  const { car_id, log_type, description, cost } = req.body;

  if (!car_id || !log_type) {
    return res
      .status(400)
      .json({ message: "car_id and log_type are required" });
  }

  const sql = `
    INSERT INTO car_logs (car_id, log_type, description, cost)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [car_id, log_type, description || "", cost || 0],
    (err, result) => {
      if (err) {
        console.error("Error adding log:", err);
        return res.status(500).json({ message: "Server error" });
      }

      res.status(201).json({ message: "Log entry added successfully!" });
    }
  );
};

// Function to get all logs for a specific car
const getLogsByCar = (req, res) => {
  const car_id = req.params.car_id;

  const sql = `SELECT * FROM car_logs WHERE car_id = ? ORDER BY log_date DESC`;

  db.query(sql, [car_id], (err, results) => {
    if (err) {
      console.error("Error fetching logs:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.status(200).json(results);
  });
};

// Function to edit a log entry
const editLog = (req, res) => {
  const log_id = req.params.log_id;
  const { log_type, description, cost } = req.body;

  if (!log_type) {
    return res.status(400).json({ message: "log_type is required" });
  }

  const sql = `
      UPDATE car_logs
      SET log_type = ?, description = ?, cost = ?
      WHERE id = ?
    `;

  db.query(
    sql,
    [log_type, description || "", cost || 0, log_id],
    (err, result) => {
      if (err) {
        console.error("Error updating log:", err);
        return res.status(500).json({ message: "Server error" });
      }

      res.status(200).json({ message: "Log updated successfully!" });
    }
  );
};

// Function to delete a log entry
const deleteLog = (req, res) => {
  const log_id = req.params.log_id;

  const sql = `DELETE FROM car_logs WHERE id = ?`;

  db.query(sql, [log_id], (err, result) => {
    if (err) {
      console.error("Error deleting log:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.status(200).json({ message: "Log deleted successfully!" });
  });
};

module.exports = { addLog, getLogsByCar, editLog, deleteLog };
