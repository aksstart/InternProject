const express = require('express');
const router = express.Router();
const { getPieChartData } = require('../controllers/pieChartController');

router.get('/pie-chart', getPieChartData);

module.exports = router;
