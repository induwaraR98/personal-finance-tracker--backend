const Notification = require("../models/Notification");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const User = require("../models/User")

// Send a notification to a user
const sendNotification = async (userId, message, type) => {
  try {
    // Find user by email
    const user = await User.findOne({ _id: userId });

    if (!user) {
      console.log(`User with email ${userEmail} not found.`);
      return;
    }

    const validTypes = ["budget", "spending", "goal", "reminder"];
    if (!validTypes.includes(type)) {
      console.log(`Invalid notification type: ${type}`);
      return;
    }

    // Create and save the notification
    const notification = new Notification({
      user: user._id,
      message,
      type,
    });

    await notification.save();

    console.log(`Notification sent to ${userEmail}: ${message}`);
  } catch (error) {
    console.error("Error sending notification:", error.message);
  }
};

// Check if the user has exceeded their budget
const checkBudgetLimit = async (userId) => {
  const budgets = await Budget.find({ user: userId });
  for (const budget of budgets) {
    const totalSpent = await Transaction.aggregate([
      { $match: { user: userId, category: budget.category, type: "expense" } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);

    const spent = totalSpent.length > 0 ? totalSpent[0].total : 0;
    if (spent > budget.limit) {
      await sendNotification(userId, `You have exceeded your ${budget.category} budget!`, "budget");
    }
  }
};

// Check for unusual spending (spike in expenses)
const checkUnusualSpending = async (userId) => {
  const recentTransactions = await Transaction.find({ user: userId, type: "expense" })
    .sort({ date: -1 })
    .limit(5);

  const avgSpending = recentTransactions.reduce((sum, tx) => sum + tx.amount, 0) / recentTransactions.length;

  if (avgSpending > 500) {
    await sendNotification(userId, "Unusual spending detected. Consider reviewing your transactions.", "spending");
  }
};

module.exports = { sendNotification, checkBudgetLimit, checkUnusualSpending };
