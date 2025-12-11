const bcrypt = require('bcryptjs');

// Mock de base de datos en memoria (temporal)
let users = [];

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, email, password, fullName } = req.body;

  // Verificar si usuario existe
  const exists = users.find(u => u.email === email || u.username === username);
  if (exists) {
    return res.status(400).json({ 
      success: false, 
      error: 'Usuario o email ya existe' 
    });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Crear usuario
  const user = {
    id: Date.now().toString(),
    username,
    email,
    password: hashedPassword,
    fullName,
    wellnessScore: 100,
    createdAt: new Date()
  };

  users.push(user);

  // Generar token simple (en producción usar JWT)
  const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

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
};
