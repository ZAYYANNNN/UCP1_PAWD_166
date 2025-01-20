const express = require('express');
const path = require('path');
const connection = require('./config');
const app = express();
const port = process.env.PORT || 3000;

// Setup EJS sebagai view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware untuk parsing request body
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  connection.query('SELECT * FROM products', (err, results) => {
    if (err) throw err;
    res.render('index', { products: results });
  });
});

app.get('/create', (req, res) => {
  res.render('create');
});

app.post('/create', (req, res) => {
  const { name, description, price } = req.body;
  connection.query(
    'INSERT INTO products (name, description, price) VALUES (?, ?, ?)',
    [name, description, price],
    (err) => {
      if (err) throw err;
      res.redirect('/');
    }
  );
});

app.get('/update/:id', (req, res) => {
  const productId = req.params.id;
  connection.query('SELECT * FROM products WHERE id = ?', [productId], (err, results) => {
    if (err) throw err;
    res.render('update', { product: results[0] });
  });
});

app.post('/update/:id', (req, res) => {
  const productId = req.params.id;
  const { name, description, price } = req.body;
  connection.query(
    'UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?',
    [name, description, price, productId],
    (err) => {
      if (err) throw err;
      res.redirect('/');
    }
  );
});

app.get('/delete/:id', (req, res) => {
  const productId = req.params.id;
  connection.query('DELETE FROM products WHERE id = ?', [productId], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});