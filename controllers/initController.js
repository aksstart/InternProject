const axios = require('axios');
const Product = require('../models/Product');

const initializeDatabase = async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const products = response.data;

    await Product.deleteMany({});
    await Product.insertMany(products);

    res.status(200).send('Database initialized successfully.');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = initializeDatabase;
