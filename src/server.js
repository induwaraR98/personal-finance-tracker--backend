require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const logger = require("./config/logger");

//Importing Route Handlers
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const reportRoutes = require("./routes/reportRoutes");
const goalRoutes = require('./routes/goalRoutes');
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoutes = require("./routes/notifications");
const errorHandler = require("./middleware/errorMiddleware");
const scheduleNotifications = require("./jobs/notificationScheduler");
const currencyRoutes = require("./routes/currencyRoutes");
const bodyParser = require('body-parser');
scheduleNotifications();

//Initializing Express App
const app = express();

// Middleware Configuration
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);
app.use(bodyParser.json());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use("/api/reports", reportRoutes);
app.use('/api/goals', goalRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/currency", currencyRoutes);
app.use('/api/reports', transactionRoutes);


// Database Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));
//Default API Route
app.get('/', (req, res) => {
    res.send('Personal Finance Tracker API');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Log API requests using Morgan
app.use(
    morgan("combined", {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );