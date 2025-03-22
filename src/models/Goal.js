const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        targetAmount: {
            type: Number,
            required: true,
        },
        currentAmount: {
            type: Number,
            default: 0, // Default progress starts at 0
        },
        deadline: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['In Progress', 'Achieved', 'Failed'],
            default: 'In Progress',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Goal', goalSchema);
