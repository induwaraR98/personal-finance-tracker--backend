const cron = require("node-cron");
const User = require("../models/User");
const { checkBudgetLimit, checkUnusualSpending } = require("../utils/notificationUtils");

const scheduleNotifications = () => {
  cron.schedule("0 8 * * *", async () => {
    console.log("Running scheduled notifications check...");
    const users = await User.find();
    for (const user of users) {
      await checkBudgetLimit(user._id);
      await checkUnusualSpending(user._id);
    }
  });
};

module.exports = scheduleNotifications;
