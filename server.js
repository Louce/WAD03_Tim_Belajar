const express = require('express');
const app = express();
const port = 3000;

const aboutUsRoute = require('./routes/aboutUsRoutes');
const greetingRoutes = require('./routes/greetingRoutes');

app.get('/', (req, res) => {
  res.send('<h1>Welcome to the homepage with Express!</h1><p><a href="/aboutus">About Us</a></p>');
});

app.use('/aboutus', aboutUsRoute);
app.use('/greeting', greetingRoutes);

app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
