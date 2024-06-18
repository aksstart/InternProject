const Product = require('../models/Product');

const getStatistics = async (req, res) => {
  try {
    const { month = 'March' } = req.query;
    const monthNumber = new Date(`${month} 1, 2000`).getMonth() + 1; // Get the month number

    const totalSaleAmount = await Product.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
          sold: true
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$price" }
        }
      }
    ]);

    const totalSoldItems = await Product.countDocuments({
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
      sold: true
    });

    const totalNotSoldItems = await Product.countDocuments({
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
      sold: false
    });

    res.json({
      month,
      totalSaleAmount: totalSaleAmount.length > 0 ? totalSaleAmount[0].totalAmount : 0,
      totalSoldItems,
      totalNotSoldItems
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getStatistics
};
