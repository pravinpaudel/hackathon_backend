const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    stress: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    mood: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports = mongoose.model('CheckIn', checkInSchema);
