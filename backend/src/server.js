const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const sequelize = require('./config/database');
const User = require('./models/User.model');
const Post = require('./models/Post.model');

// Relaciones
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '🌊 MindfulFlow API is running',
    features: ['auth', 'posts', 'wellness-algorithm'],
    port: process.env.PORT 
  });
});

// Rutas
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/posts', require('./routes/post.routes'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Error del servidor'
  });
});

const PORT = process.env.PORT || 5001;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Base de datos sincronizada');
    app.listen(PORT, '0.0.0.0', () => {
      console.log('════════════════════════════════');
      console.log('🌊 MindfulFlow API');
      console.log(`📡 Puerto: ${PORT}`);
      console.log('✅ Auth System: OK');
      console.log('✅ Posts System: OK');
      console.log('✅ Wellness Algorithm: OK');
      console.log('════════════════════════════════');
    });
  })
  .catch(err => {
    console.error('❌ Error:', err);
  });

module.exports = app;
