const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");

// Route to add a car
router.post("/add", carController.addCar);

// (Later:  /get, /edit, /delete here)

module.exports = router;
