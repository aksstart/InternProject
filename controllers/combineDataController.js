const axios = require('axios');

const combineData = async (req, res) => {
  try {
    // Call all APIs concurrently
    const [transactionsResponse, statisticsResponse, barChartDataResponse, pieChartDataResponse] = await Promise.all([
      axios.get('http://localhost:5000/api/transactions'),
      axios.get('http://localhost:5000/api/statistics'),
      axios.get('http://localhost:5000/api/bar-chart'),
      axios.get('http://localhost:5000/api/pie-chart')
    ]);

    // Extract data from responses
    const transactions = transactionsResponse.data;
    const statistics = statisticsResponse.data;
    const barChartData = barChartDataResponse.data;
    const pieChartData = pieChartDataResponse.data;

    // Combine into final response
    const combinedData = {
      transactions,
      statistics,
      barChartData,
      pieChartData
    };

    res.json(combinedData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  combineData
};
