module.exports = (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: '🌊 MindfulFlow API on Vercel',
    timestamp: new Date().toISOString()
  });
};
