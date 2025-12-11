const bcrypt = require('bcryptjs');

// Mock de base de datos
let users = [];

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  
  if (!user) {
    return res.status(401).json({ 
      success: false, 
      error: 'Credenciales inválidas' 
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    return res.status(401).json({ 
      success: false, 
      error: 'Credenciales inválidas' 
    });
  }

  const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

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
};
