const express = require('express');
const { getAdminDashboard, getUserDashboard } = require('../controllers/dashboardController');
const { authenticateUser } = require('../middleware/authMiddleware'); // Ensure this is correct

const router = express.Router();

router.get('/admin', authenticateUser, getAdminDashboard);
router.get('/user', authenticateUser, getUserDashboard);

module.exports = router;
