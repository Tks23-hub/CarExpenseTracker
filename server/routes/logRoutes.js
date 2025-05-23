const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");
const verifyToken = require("../middleware/authMiddleware");

// Route to add a log entry
router.post("/add", verifyToken, logController.addLog);

// Route to get all stats for a specific user
router.get("/stats", verifyToken, logController.getStats);

// Route to get all logs
router.get("/all", verifyToken, logController.getAllLogsForUser);

// Route to get all logs by car ID
router.get("/:car_id", verifyToken, logController.getLogsByCar);

// Route to delete a log entry by ID
router.put("/edit/:log_id", verifyToken, logController.editLog);

// Route to delete a log entry by ID
router.delete("/delete/:log_id", verifyToken, logController.deleteLog);

module.exports = router;
