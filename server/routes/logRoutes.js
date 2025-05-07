const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");

// Route to add a log entry
router.post("/add", logController.addLog);

// Route to get all logs by car ID
router.get("/:car_id", logController.getLogsByCar);

// Route to delete a log entry by ID
router.put("/edit/:log_id", logController.editLog);

// Route to delete a log entry by ID
router.delete("/delete/:log_id", logController.deleteLog);

module.exports = router;
