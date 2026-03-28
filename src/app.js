const express = require('express');
const apiRoutes = require('./routes');
const logger = require('./middlewares/logger');

const app = express();

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Cognitive Builder API is running.' });
});

app.use('/api', apiRoutes);

// Basic centralized error handling for the MVP.
app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  return res.status(500).json({ error: 'Internal server error.' });
});

module.exports = app;
