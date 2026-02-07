import express from 'express';

const app = express();
const PORT = 8000;

// Middleware to parse JSON
app.use(express.json());

// GET request example
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the server!'
 });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
