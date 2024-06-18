const express = require('express');
const router = express.Router();
const initializeDatabase = require('../controllers/initController');

router.get('/init-database', initializeDatabase);

module.exports = router;
