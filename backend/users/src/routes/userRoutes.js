const express = require('express');
const { getUserByID, getAllUsers } = require('../controllers/authController.js');
const router = express.Router();

router.get('/', getAllUsers)
router.get('/:id', getUserByID)

module.exports = router;
