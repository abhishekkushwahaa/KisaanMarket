const express = require('express');
const { registerUser, loginUser, getUserByID } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
