require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const { seedNews } = require('./utils/seedNews');

const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const newsRoute = require('./routes/newsRoute');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));

app.use(express.json());

// API Routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/news', newsRoute);

// Root healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Database sync and server startup
db.sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log('Database connected & synced successfully.');
    // Seed sample news if empty
    await seedNews();
    app.listen(port, () => {
      console.log(`Nuzio AI backend server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message);
  });