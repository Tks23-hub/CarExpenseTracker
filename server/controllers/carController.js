const db = require("../db");

// Function to add a new car
const addCar = (req, res) => {
  const user_id = req.user.id; // Extract user ID from the token
  // const user_id = req.body.user_id; // Alternatively, you can get it from the request body if needed but you cant trust it
  const { type, model, year, color, license_plate } = req.body;

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

// Function to get all cars by user ID
const getCarsByUser = (req, res) => {
  const user_id = req.user.id;

  const sql = `SELECT * FROM cars WHERE user_id = ?`;

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching cars:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.status(200).json(results);
  });
};

// Function to edit a car by ID
const editCar = (req, res) => {
  const car_id = req.params.car_id;
  const { type, model, year, color, license_plate } = req.body;

  if (!type || !model || !year || !color || !license_plate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = `
    UPDATE cars SET type = ?, model = ?, year = ?, color = ?, license_plate = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [type, model, year, color, license_plate, car_id],
    (err, result) => {
      if (err) {
        console.error("Error updating car:", err);
        return res.status(500).json({ message: "Server error" });
      }

      res.status(200).json({ message: "Car updated successfully!" });
    }
  );
};

// Function to delete a car by ID
const deleteCar = (req, res) => {
  const car_id = req.params.car_id;

  const sql = `DELETE FROM cars WHERE id = ?`;

  db.query(sql, [car_id], (err, result) => {
    if (err) {
      console.error("Error deleting car:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.status(200).json({ message: "Car deleted successfully!" });
  });
};

module.exports = { addCar, getCarsByUser, editCar, deleteCar };
