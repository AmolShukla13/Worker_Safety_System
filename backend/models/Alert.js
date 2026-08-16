const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Low",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Alert", AlertSchema);