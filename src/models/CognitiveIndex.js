const mongoose = require('mongoose');

const cognitiveIndexSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    ciScore: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    status: {
      type: String,
      required: true,
      enum: ['Stable', 'Drifting', 'Burnout Risk'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports = mongoose.model('CognitiveIndex', cognitiveIndexSchema);
