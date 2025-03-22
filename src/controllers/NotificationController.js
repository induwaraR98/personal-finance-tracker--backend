const mongoose = require("mongoose");
const Notification = require("../models/Notification");

// @desc   Get all notifications for a user
// @route  GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    console.log("Fetching notifications for user:", req.user); // Debugging log

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    // Fetch notifications
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 });

    console.log("Fetched Notifications:", notifications); // Debugging log

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Mark a notification as read
// @route  PATCH /api/notifications/:id
const markAsRead = async (req, res) => {
  try {
    console.log("Marking notification as read. Params:", req.params); // Debugging log

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid notification ID format" });
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.isRead) {
      return res.status(200).json({ message: "Notification is already marked as read", notification });
    }

    notification.isRead = true;
    await notification.save();

    console.log("Updated Notification:", notification); // Debugging log
    res.status(200).json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getNotifications, markAsRead };
