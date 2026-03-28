const GameSession = require('../models/GameSession');

const createGameSession = async (req, res, next) => {
  try {
    const { reactionTime, accuracy } = req.body;
    const userId = process.env.DUMMY_USER_ID || 'demo-user-1';

    if (reactionTime === undefined || accuracy === undefined) {
      return res
        .status(400)
        .json({ error: 'reactionTime and accuracy are required.' });
    }

    const gameSession = await GameSession.create({
      userId,
      reactionTime,
      accuracy,
    });

    return res.status(201).json({
      message: 'Game session saved successfully.',
      data: gameSession,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createGameSession,
};
