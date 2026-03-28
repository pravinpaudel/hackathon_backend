const { clamp, normalizeScaleOneToFive } = require('./normalizationService');

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

const calculateCognitiveIndex = ({ stress, mood, accuracy }) => {
  const normalizedStress = normalizeScaleOneToFive(stress);
  const normalizedMood = normalizeScaleOneToFive(mood);
  const boundedAccuracy = clamp(accuracy, 0, 1);

  const ciScore =
    0.5 * normalizedStress +
    0.3 * (1 - normalizedMood) +
    0.2 * (1 - boundedAccuracy);

  const boundedScore = clamp(ciScore, 0, 1);
  const roundedScore = Number(boundedScore.toFixed(3));

  return {
    ciScore: roundedScore,
    ...getStatusAndMessage(roundedScore),
  };
};

module.exports = {
  calculateCognitiveIndex,
};
