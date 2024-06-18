const Product = require('../models/Product');

const getTransactions = async (req, res) => {
  try {
    const { month = '', page = 1, perPage = 10, search = '' } = req.query;
    let monthNumber;

    if (month) {
      const date = new Date(`${month} 1, 2000`);
      if (date.toString() !== 'Invalid Date') {
        monthNumber = date.getMonth() + 1;
      } else {
        return res.status(400).json({ message: 'Invalid month' });
      }
    }

    const query = {};

    if (monthNumber) {
      query.dateOfSale = { $exists: true };
      query.$expr = { $eq: [{ $month: "$dateOfSale" }, monthNumber] };
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];

      if (!isNaN(Number(search))) {
        query.$or.push({ price: Number(search) });
      }
    }

    const transactions = await Product.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    const total = await Product.countDocuments(query);

    res.json({
      page: parseInt(page),
      perPage: parseInt(perPage),
      total,
      totalPages: Math.ceil(total / perPage),
      transactions
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getTransactions
};
