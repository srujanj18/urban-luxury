const express = require('express');
const cors = require('cors');
const db = require('./db.cjs');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/place-order', (req, res) => {
  const { name, product, size, color } = req.body;

  const query = 'INSERT INTO orders (name, product, size, color) VALUES (?, ?, ?, ?)';
  db.query(query, [name, product, size, color], (err, result) => {
    if (err) {
      console.error('❌ Error inserting order:', err);
      return res.status(500).json({ success: false, error: err });
    }
    res.status(200).json({ success: true, orderId: result.insertId });
  });
});

app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});
