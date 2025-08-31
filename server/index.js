const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Load dotenv
let dotenv;
try {
  dotenv = require('dotenv');
  dotenv.config();
} catch (error) {
  console.warn('dotenv not found, using default environment variables');
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urban_luxury';
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync('nizmeh123', 10);

// Middleware
app.use(cors({ 
  origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:8081'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'Uploads'), {
  setHeaders: (res, path) => {
    res.set('Content-Type', 'image/jpeg');
    console.log(`[${new Date().toISOString()}] Serving image: ${path}`);
  }
}));

// Debug CORS preflight requests
app.options('*', cors(), (req, res) => {
  console.log(`[${new Date().toISOString()}] OPTIONS ${req.url} - CORS preflight handled`);
  res.status(200).end();
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, 'Uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Connect MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB database'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err));

// Brand Schema
const brandSchema = new mongoose.Schema({
  id: String,
  name: String,
  logo: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});
const Brand = mongoose.model('Brand', brandSchema);

// Product Schema
const productSchema = new mongoose.Schema({
  brandId: String,
  brandName: String,
  productType: String,
  productName: String,
  description: String,
  sizes: [String],
  mrp: Number,
  offerPrice: Number,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', productSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  orderId: String,
  product: {
    id: String,
    name: String,
    price: Number,
    image: String,
    brandName: String,
    selectedColor: String,
    selectedSize: String,
    category: String
  },
  userInfo: {
    name: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  paymentMethod: String,
  status: { type: String, default: 'Order Placed' },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// Debug log
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ---------- AUTH ----------
app.post('/api/admin/login', async (req, res) => {
  console.log('Admin login attempt:', req.body);
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }

    const isPasswordValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'fallback-secret-key', { expiresIn: '1h' });
    res.json({
      success: true,
      message: 'Login successful',
      user: { name: 'Admin', role: 'admin' },
      token: token
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------- BRANDS ----------
app.get('/api/brands', async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/brands', upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No logo uploaded' });
    }

    const brandData = JSON.parse(req.body.brandData);
    const logoUrl = `${SERVER_URL}/uploads/${req.file.filename}`;

    const newBrand = new Brand({ ...brandData, logo: logoUrl });
    await newBrand.save();

    res.json({ success: true, message: 'Brand added successfully', brand: newBrand });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});



// ---------- PRODUCTS ----------
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Product counts by brand
app.get('/api/products/counts', async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $group: { _id: "$brandId", count: { $sum: 1 } } }
    ]);

    const counts = {};
    products.forEach((p) => {
      counts[p._id] = p.count;
    });

    res.json(counts);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add product (with image)
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const productData = JSON.parse(req.body.productData);
    const imageUrl = `${SERVER_URL}/Uploads/${req.file.filename}`;

    const newProduct = new Product({ ...productData, imageUrl });
    await newProduct.save();

    res.json({ success: true, message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete the associated image file
    const imagePath = path.join(__dirname, 'Uploads', path.basename(product.imageUrl));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log(`[${new Date().toISOString()}] Deleted image: ${imagePath}`);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ---------- ORDERS ----------
app.post('/api/orders', async (req, res) => {
  try {
    const { product, userInfo, paymentMethod } = req.body;
    if (!product || !userInfo || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newOrder = new Order({
      orderId,
      product,
      userInfo,
      paymentMethod,
      status: 'Order Placed',
      createdAt: new Date()
    });
    await newOrder.save();

    res.json({ success: true, message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const { userEmail } = req.query;
    let query = {};
    
    if (userEmail) {
      // Since the current order schema doesn't have userEmail field,
      // we'll need to modify the schema or find another way to filter
      // For now, we'll return all orders until we update the schema
      console.log(`Filtering orders by user email: ${userEmail}`);
      // TODO: Update order schema to include userEmail field for proper filtering
    }
    
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------- FRONTEND ----------
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// ---------- ERROR HANDLER ----------
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// ---------- START SERVER ----------
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} in use, trying ${PORT + 1}`);
    app.listen(PORT + 1, () => console.log(`🚀 Server running on port ${PORT + 1}`));
  } else {
    console.error('Server error:', err);
  }
});