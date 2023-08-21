const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./src/routes/authRoutes');
const passwordResetRoutes = require('./src/routes/passwordResetRoutes');
const pool = require('./src/database');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Allow requests from your frontend domain (replace with your actual frontend URL)
const allowedOrigins = ['http://localhost:3001'];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

// Middleware to protect routes with API key
const apiKeyMiddleware = (req, res, next) => {

    const apiKey = req.header('x-api-key');

    if (!apiKey || apiKey !== process.env.API_KEY) {
        console.log('someone not authorized tried to talk to server');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    console.log('authorized api request received')
    next();
  };

// Apply the middleware to specific routes
app.use('/auth', apiKeyMiddleware, authRoutes);
app.use('/password-reset', passwordResetRoutes);


const port = 3007;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
