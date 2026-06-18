const Product = require('../model/Product');
const Order = require('../model/Order');
const User = require('../model/User');

// @desc Get all orders
// @route GET /api/admin/orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get dashboard stats
// @route GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();
    const orders = await Order.find({});
    
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    res.json({
      users: usersCount,
      products: productsCount,
      orders: orders.length,
      revenue: totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOrders, getStats };
