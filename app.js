const express = require('express');
const connectDB = require('./config/db');
const initDatabaseRoute = require('./routes/initDatabase');
const transactionsRoute = require('./routes/transactions');
const statisticsRoute = require('./routes/statistics');
const barChartRoute = require('./routes/barChart');
const pieChartRoute = require('./routes/pieChart');
const combineDataRoute = require('./routes/combineData'); // Include the new route
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors())

// Connect to MongoDB
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api', initDatabaseRoute);
app.use('/api', transactionsRoute);
app.use('/api', statisticsRoute);
app.use('/api', barChartRoute);
app.use('/api', pieChartRoute);
app.use('/api', combineDataRoute); // Use the new combined data route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
