const express = require('express');
const router = express.Router();
const { getBarChartData } = require('../controllers/barChartController');

router.get('/bar-chart', getBarChartData);

module.exports = router;
