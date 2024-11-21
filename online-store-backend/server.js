const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Order = require('./models/Order');

const User = require('./models/User');
const Product = require('./models/Product'); 

const app = express();
const secret = 'nZ7$kB8vY^tT1w9oLqE&dP@z#uWjKxD';

app.use(cors());
app.use(express.json());

mongoose
  .connect('mongodb://localhost:27017/online-store', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Підключено до MongoDB'))
  .catch((err) => console.error('Помилка підключення до MongoDB:', err));

  app.post('/auth/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const user = new User({ name, email, password });
      await user.save();
      res.status(201).json({ message: 'User successfully registered' });
    } catch (err) {
      res.status(400).json({ error: 'User registration error' });
    }
  });
  
  app.post('/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
      res.status(200).json({ token, user: { id: user._id, name: user.name } });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  

app.get('/api/products', async (req, res) => {
  const { category } = req.query;
  let filteredProducts;

  if (category) {
    filteredProducts = await Product.find({ category })
      .sort({ category: 1, price: 1 }); 
  } else {
    filteredProducts = await Product.find()
      .sort({ category: 1, price: 1 }); 
  }

  res.json(filteredProducts);
});

app.get('/auth/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; 
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select('-password'); 
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/api/orders', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, secret);

    const { items, totalAmount, address, name, surname, phoneNumber } = req.body;

    const order = new Order({
      userId: decoded.id,
      items,
      totalAmount,
      address,
      name,
      surname,
      phoneNumber,
    });

    await order.save();

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/api/orders', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, secret);
    const orders = await Order.find({ userId: decoded.id }).populate('items.productId');
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.listen(5000, () => {
  console.log('Сервер запущено на порті 5000');
});
