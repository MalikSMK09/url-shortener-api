const express = require('express');
const cors = require('cors');
const urlRouter = require('./routes/url');

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use('/', urlRouter);

// health check
app.get('/health', (req, res) => res.json({ status: 'ok', message: 'URL Shortener API' }));

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
