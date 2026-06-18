require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./model/User');
const Product = require('./model/Product');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany();
    await User.deleteMany();

    console.log('Fetching 60 products from dummy API...');
    const response = await fetch('https://dummyjson.com/products?limit=60');
    const data = await response.json();
    
    const formattedProducts = data.products.map(p => ({
      name: p.title,
      description: p.description,
      // Randomizing price to look like INR (DummyJSON is in USD, so we multiply by 80 approx)
      price: Math.round(p.price * 80),
      image: p.thumbnail || p.images[0],
      category: p.category,
      brand: p.brand || 'Generic',
      countInStock: Math.floor(Math.random() * 50) + 1, // Random stock between 1-50
      discountPercentage: p.discountPercentage || 0,
      rating: p.rating,
      numReviews: Math.floor(Math.random() * 500) + 10 // Random reviews
    }));

    await Product.insertMany(formattedProducts);
    console.log(`✅ ${formattedProducts.length} Products seeded!`);

    // Create Admin User
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const demoPassword = await bcrypt.hash('demo123', salt);

    await User.create([
      {
        name: 'Admin User',
        email: 'admin@shopez.com',
        password: adminPassword,
        role: 'admin',
        cart: []
      },
      {
        name: 'Demo User',
        email: 'demo@shopez.com',
        password: demoPassword,
        role: 'user',
        cart: []
      }
    ]);
    console.log('✅ Users seeded');
    console.log('\nAdmin: admin@shopez.com / admin123\nDemo:  demo@shopez.com  / demo123');
    process.exit();
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
