const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// Registro
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;
    
    const userExists = await User.findOne({ 
      where: { 
        [require('sequelize').Op.or]: [{ email }, { username }]
      } 
    });
    
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        error: 'Usuario o email ya existe' 
      });
    }
    
    const user = await User.create({
      username,
      email,
      password,
      fullName
    });
    
    const token = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRE }
    );
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        wellnessScore: user.wellnessScore
      }
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      error: 'Error en el registro' 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ 
        success: false, 
        error: 'Credenciales inválidas' 
      });
    }
    
    const token = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRE }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        wellnessScore: user.wellnessScore
      }
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      error: 'Error en el login' 
    });
  }
});

module.exports = router;
