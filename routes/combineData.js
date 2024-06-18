const express = require('express');
const router = express.Router();
const { combineData } = require('../controllers/combineDataController');

router.get('/combine-data', combineData);

module.exports = router;
