const calculateSummary = require('../utils/calculateSummary');

exports.getSummary = async (req, res) => {
  try {
    const userId = req.user.id; // assuming authMiddleware adds user to req
    const summary = await calculateSummary(userId);
    res.status(200).json(summary);
  } catch (error) {
    console.error('Error calculating summary:', error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
};
