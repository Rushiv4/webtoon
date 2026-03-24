const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads')); // For serving uploaded images

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/webtoons', require('./routes/webtoonRoutes'));
app.use('/api/chapters', require('./routes/chapterRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/external', require('./routes/externalRoutes')); // External API integration

// Basic route
app.get('/', (req, res) => {
  res.send('Webtoon API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
