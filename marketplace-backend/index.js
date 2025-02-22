require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const app = express();
const router = require('./routes');

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100
});

app.use(limiter);
const allowedOrigins = [
  process.env.FRONTEND_URL, 
  'https://your-vercel-app.vercel.app',
  'https://*.vercel.app', 
  ...(process.env.NODE_ENV === 'development' ? [
    'http://localhost:5173',
    'http://localhost:5174'
  ] : [])
];

app.use(cors({
  origin: function (origin, callback) { 
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowedOrigin => 
      origin === allowedOrigin || 
      origin.endsWith(`.${allowedOrigin}`)
    )) {
      return callback(null, true);
    }
    
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use('/api', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
