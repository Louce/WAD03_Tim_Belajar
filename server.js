const express = require('express');
const app = express();
const port = 3000;

const aboutUsRoutes = require('./routes/aboutUsRoutes');
const greetingRoutes = require('./routes/greetingRoutes');
const userRoutes = require('./routes/userRoutes');
const productsRoutes = require('./routes/productsRoutes');
const cartRoutes = require('./routes/cartRoutes');

// Serve static demo UI
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('<h1>Welcome to the homepage with Express!</h1><p><a href="/aboutus">About Us (JSON)</a> | <a href="/index.html">Demo UI</a></p>');
});

app.use('/aboutus', aboutUsRoutes);
app.use('/greeting', greetingRoutes);
app.use('/users', userRoutes);
app.use('/products', productsRoutes);
app.use('/cart', cartRoutes);

app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
