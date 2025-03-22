const express = require("express");
const { getNotifications, markAsRead } = require("../controllers/NotificationController");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateUser, getNotifications);
router.patch("/:id", authenticateUser, markAsRead);

module.exports = router;
