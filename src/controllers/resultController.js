const CheckIn = require('../models/CheckIn');
const GameSession = require('../models/GameSession');
const CognitiveIndex = require('../models/CognitiveIndex');
const { calculateCognitiveIndex } = require('../services/cognitiveIndexService');

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

    const result = calculateCognitiveIndex({
      stress: latestCheckIn.stress,
      mood: latestCheckIn.mood,
      accuracy: latestGameSession.accuracy,
    });

    await CognitiveIndex.create({
      userId,
      ciScore: result.ciScore,
      status: result.status,
    });

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getLatestResult,
};
