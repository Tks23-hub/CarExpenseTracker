const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");

// Route to add a car
router.post("/add", carController.addCar);

// Route to get all cars by user ID
router.get("/:user_id", carController.getCarsByUser);

// Route to delete a car by ID
router.put("/edit/:car_id", carController.editCar);

// Route to delete a car by ID
router.delete("/delete/:car_id", carController.deleteCar);

module.exports = router;
