const CheckIn = require('../models/CheckIn');

const createCheckIn = async (req, res, next) => {
  try {
    const { stress, mood } = req.body;
    const userId = process.env.DUMMY_USER_ID || 'demo-user-1';

    if (stress === undefined || mood === undefined) {
      return res.status(400).json({ error: 'stress and mood are required.' });
    }

    const checkIn = await CheckIn.create({
      userId,
      stress,
      mood,
    });

    return res.status(201).json({
      message: 'Check-in saved successfully.',
      data: checkIn,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createCheckIn,
};
