const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");

// Route to add a log entry
router.post("/add", logController.addLog);

// Route to get all logs by car ID
router.get("/:car_id", logController.getLogsByCar);

module.exports = router;
