const User = require('../model/User');
const Product = require('../model/Product');

// @desc Get user cart
// @route GET /api/cart
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add item to cart
// @route POST /api/cart
const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const user = await User.findById(req.user._id);

    const existItem = user.cart.find(x => x.product.toString() === productId);

    if (existItem) {
      existItem.qty = Number(qty);
    } else {
      user.cart.push({ product: productId, qty: Number(qty) });
    }

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.json(updatedUser.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Remove item from cart
// @route DELETE /api/cart/:productId
const removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(x => x.product.toString() !== req.params.productId);
    await user.save();
    
    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.json(updatedUser.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Clear cart
// @route DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart };
