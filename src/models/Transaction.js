  const mongoose = require("mongoose");

  const transactionSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      type: {
        type: String,
        enum: ["income", "expense"],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
        min: [0.01, "Amount must be greater than zero"],
      },
      currency: {
        type: String,
        required: true,
        default: "USD",
      }, // Default to USD
      exchangeRate: {
        type: Number,
        required: function () {
          return this.currency !== "USD"; // Only required if not USD
        },
        default: 1,
      }, // Default 1 for USD
      convertedAmount: {
        type: Number,
        required: true,
      }, // Amount converted to default currency (USD)
      category: {
        type: String,
        enum: [
          "Food",
          "Transportation",
          "Entertainment",
          "Bills",
          "Shopping",
          "Health",
          "Education",
          "Salary",
          "Savings",
          "Investments",
          "Others",
        ], // More categories added
        required: true,
      },
      description: {
        type: String,
        trim: true,
      },
      tags: {
        type: [String],
        default: [],
      },
      date: {
        type: Date,
        default: Date.now,
      },
      isRecurring: {
        type: Boolean,
        default: false,
      },
      recurrencePattern: {
        type: String, // e.g., daily, weekly, monthly
        validate: {
          validator: function (value) {
            return !this.isRecurring || ["daily", "weekly", "monthly"].includes(value);
          },
          message: "Invalid recurrence pattern. Use 'daily', 'weekly', or 'monthly'.",
        },
      },
      recurrenceEndDate: {
        type: Date,
        validate: {
          validator: function (value) {
            return !this.isRecurring || (value && value > this.date);
          },
          message: "Recurrence end date must be after the transaction date.",
        },
      },
    },
    { timestamps: true }
  );

  module.exports = mongoose.model("Transaction", transactionSchema);
