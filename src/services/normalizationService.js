const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const normalizeScaleOneToFive = (value) => {
  const normalized = (value - 1) / 4;
  return clamp(normalized, 0, 1);
};

module.exports = {
  clamp,
  normalizeScaleOneToFive,
};
