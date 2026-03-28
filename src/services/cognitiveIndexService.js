const CognitiveIndex = require('../models/CognitiveIndex');
const { clamp, normalizeScaleOneToFive } = require('./normalizationService');

const EMA_ALPHA = 0.7;

const getStatusAndMessage = (ciScore) => {
  if (ciScore < 0.3) {
    return {
      status: 'Stable',
      message: "You're doing well. Keep going!",
    };
  }

  if (ciScore < 0.6) {
    return {
      status: 'Drifting',
      message: "You're getting tired. Take a short break.",
    };
  }

  return {
    status: 'Burnout Risk',
    message: 'You may be experiencing burnout. Try a calming activity.',
  };
};

const calculateCIToday = ({ stress, mood, accuracy }) => {
  const normalizedStress = normalizeScaleOneToFive(stress);
  const normalizedMood = normalizeScaleOneToFive(mood);
  const boundedAccuracy = clamp(accuracy, 0, 1);

  const ciScore =
    0.5 * normalizedStress +
    0.3 * (1 - normalizedMood) +
    0.2 * (1 - boundedAccuracy);

  return clamp(ciScore, 0, 1);
};

const applyEma = (ciToday, ciPrevious) => {
  if (ciPrevious === null || ciPrevious === undefined) {
    return ciToday;
  }

  return EMA_ALPHA * ciToday + (1 - EMA_ALPHA) * ciPrevious;
};

const calculateAndStoreCognitiveIndex = async ({ userId, stress, mood, accuracy }) => {
  const ciToday = calculateCIToday({ stress, mood, accuracy });

  const latestPreviousCI = await CognitiveIndex.findOne({ userId }).sort({
    createdAt: -1,
  });

  const ciPrevious = latestPreviousCI ? latestPreviousCI.ciScore : null;
  const ciFinal = clamp(applyEma(ciToday, ciPrevious), 0, 1);
  const roundedFinalScore = Number(ciFinal.toFixed(3));
  const classification = getStatusAndMessage(roundedFinalScore);

  await CognitiveIndex.create({
    userId,
    ciScore: roundedFinalScore,
    status: classification.status,
  });

  return {
    ciScore: roundedFinalScore,
    ...classification,
  };
};

module.exports = {
  calculateAndStoreCognitiveIndex,
};
