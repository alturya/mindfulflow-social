const express = require('express');
const router = express.Router();
const Post = require('../models/Post.model');
const User = require('../models/User.model');
const { protect } = require('../middleware/auth.middleware');

// Crear post (protegido)
router.post('/', protect, async (req, res) => {
  try {
    const { content, mediaUrls, contentCategory } = req.body;
    
    const post = await Post.create({
      userId: req.user.id,
      content,
      mediaUrls: mediaUrls || [],
      contentCategory: contentCategory || 'other'
    });
    
    // Calcular wellness score
    post.calculateWellnessScore();
    await post.save();
    
    res.status(201).json({
      success: true,
      post
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Error creando post'
    });
  }
});

// Obtener feed (protegido)
router.get('/feed', protect, async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { status: 'active' },
      include: [{
        model: User,
        attributes: ['id', 'username', 'fullName', 'avatar']
      }],
      order: [
        ['wellnessScore', 'DESC'],
        ['createdAt', 'DESC']
      ],
      limit: 20
    });
    
    res.json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo feed'
    });
  }
});

// Obtener post por ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{
        model: User,
        attributes: ['id', 'username', 'fullName', 'avatar', 'wellnessScore']
      }]
    });
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post no encontrado'
      });
    }
    
    res.json({
      success: true,
      post
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo post'
    });
  }
});

module.exports = router;
