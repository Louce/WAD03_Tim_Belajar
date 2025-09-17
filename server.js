const express = require('express');
const app = express();
const port = 3000;

// Route for the homepage
app.get('/', (req, res) => {
  res.send('Welcome to the homepage with Express!');
});

// Route for the about page
app.get('/about', (req, res) => {
  res.send('This is the about page with Express.');
});

// Handle 404 - Not Found
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});