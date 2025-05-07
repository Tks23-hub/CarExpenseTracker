const db = require("../db");

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

module.exports = { addLog, getLogsByCar };
