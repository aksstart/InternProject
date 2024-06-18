const Product = require('../models/Product');

const getPieChartData = async (req, res) => {
  try {
    const { month = 'March' } = req.query;
    const monthNumber = new Date(`${month} 1, 2000`).getMonth() + 1; // Get the month number

    const pipeline = [
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] }
        }
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ];

    const pieChartData = await Product.aggregate(pipeline);

    res.json({
      month,
      pieChartData
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getPieChartData
};
