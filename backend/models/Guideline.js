const mongoose = require("mongoose");

const GuidelineSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "General",
        "Helmet",
        "Electrical",
        "Fire",
        "Construction",
      ],
      default: "General",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Guideline",
  GuidelineSchema
);