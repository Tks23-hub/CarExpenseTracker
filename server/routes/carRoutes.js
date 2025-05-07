const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");
const verifyToken = require("../middleware/authMiddleware");

// Route to add a car
router.post("/add", verifyToken, carController.addCar);

// Route to get all cars by user ID
// Note: The user_id is extracted from the token in the controller
router.get("/", verifyToken, carController.getCarsByUser);

// Route to delete a car by ID
router.put("/edit/:car_id", verifyToken, carController.editCar);

// Route to delete a car by ID
router.delete("/delete/:car_id", verifyToken, carController.deleteCar);

module.exports = router;
