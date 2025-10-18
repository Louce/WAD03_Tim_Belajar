const express = require('express');
const app = express();
const port = 3000;

// Only Dendi's work: User Management + Database + Unit Testing
const userRoutes = require('./routes/userRoutes');

// Other team members' routes (commented out)
// const aboutUsRoutes = require('./routes/aboutUsRoutes');
// const greetingRoutes = require('./routes/greetingRoutes');
// const productsRoutes = require('./routes/productsRoutes');
// const cartRoutes = require('./routes/cartRoutes');

// Serve static demo UI
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect('/user-management-demo.html');
});

// Only Dendi's user management routes
app.use('/users', userRoutes);

// Other team members' routes (commented out)
// app.use('/aboutus', aboutUsRoutes);
// app.use('/greeting', greetingRoutes);
// app.use('/products', productsRoutes);
// app.use('/cart', cartRoutes);

app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
