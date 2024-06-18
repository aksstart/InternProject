const Product = require('../models/Product');

const getBarChartData = async (req, res) => {
  try {
    const { month = 'March' } = req.query;
    const monthNumber = new Date(`${month} 1, 2000`).getMonth() + 1; // Get the month number

    const priceRanges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity } // 'Infinity' for prices above 900
    ];

    const priceRangeData = [];

    for (const range of priceRanges) {
      const count = await Product.countDocuments({
        $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
        price: { $gte: range.min, $lte: range.max }
      });
      priceRangeData.push({
        priceRange: `${range.min}-${range.max}`,
        count
      });
    }

    res.json({
      month,
      priceRangeData
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getBarChartData
};
