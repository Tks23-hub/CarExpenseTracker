const db = require("../db");

const addCar = (req, res) => {
  const { user_id, type, model, year, color, license_plate } = req.body;

  if (!user_id || !type || !model || !year || !color || !license_plate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = `
    INSERT INTO cars (user_id, type, model, year, color, license_plate)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [user_id, type, model, year, color, license_plate],
    (err, result) => {
      if (err) {
        console.error("Error inserting car:", err);
        return res.status(500).json({ message: "Server error" });
      }

      res.status(201).json({ message: "Car added successfully!" });
    }
  );
};

module.exports = { addCar };
