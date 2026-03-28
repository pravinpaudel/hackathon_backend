const CheckIn = require('../models/CheckIn');
const GameSession = require('../models/GameSession');
const {
  calculateAndStoreCognitiveIndex,
} = require('../services/cognitiveIndexService');

const getLatestResult = async (req, res, next) => {
  try {
    const userId = process.env.DUMMY_USER_ID || 'demo-user-1';

    const [latestCheckIn, latestGameSession] = await Promise.all([
      CheckIn.findOne({ userId }).sort({ createdAt: -1 }),
      GameSession.findOne({ userId }).sort({ createdAt: -1 }),
    ]);

    if (!latestCheckIn || !latestGameSession) {
      return res.status(404).json({
        error:
          'Not enough data to calculate cognitive index. Submit both check-in and game session first.',
      });
    }

    const result = await calculateAndStoreCognitiveIndex({
      userId,
      stress: latestCheckIn.stress,
      mood: latestCheckIn.mood,
      accuracy: latestGameSession.accuracy,
    });

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getLatestResult,
};
