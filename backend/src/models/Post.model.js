const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  mediaUrls: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  // ===== WELLNESS SCORING =====
  wellnessScore: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
    validate: {
      min: 0,
      max: 100
    }
  },
  sentimentScore: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0
  },
  contentCategory: {
    type: DataTypes.ENUM(
      'educational',
      'inspirational',
      'creative',
      'informative',
      'entertainment',
      'personal',
      'wellness',
      'other'
    ),
    defaultValue: 'other'
  },
  // ===== ENGAGEMENT =====
  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  positiveImpactCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  commentsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  sharesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  viewsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  // ===== ESTADO =====
  status: {
    type: DataTypes.ENUM('active', 'flagged', 'removed'),
    defaultValue: 'active'
  },
  visibility: {
    type: DataTypes.ENUM('public', 'friends', 'private'),
    defaultValue: 'public'
  }
}, {
  timestamps: true,
  tableName: 'posts'
});

// Método para calcular wellness score
Post.prototype.calculateWellnessScore = function() {
  let score = 50;
  
  // Categorías positivas
  if (this.contentCategory === 'educational') score += 15;
  if (this.contentCategory === 'inspirational') score += 15;
  if (this.contentCategory === 'wellness') score += 20;
  
  // Sentimiento
  score += this.sentimentScore * 10;
  
  // Engagement positivo
  score += Math.min(10, this.positiveImpactCount / 10);
  
  this.wellnessScore = Math.max(0, Math.min(100, Math.round(score)));
  return this.wellnessScore;
};

module.exports = Post;
