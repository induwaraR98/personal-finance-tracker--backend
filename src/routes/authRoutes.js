const express = require('express');
const { register, login } = require('../controllers/authController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Example of a protected route
router.get('/profile', authenticateUser, (req, res) => {
    res.json({ message: 'Profile data', user: req.user });
});

// Example of an admin-only route
router.get('/admin', authenticateUser, authorizeRoles('admin'), (req, res) => {
    res.json({ message: 'Admin access granted' });
});

module.exports = router;
