const mongoose = require("mongoose");

const chefSuggestionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500,
  },
  category: {
    type: String,
  },
  price: {
    type: Number,
    min: 0,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: function () {
      //  return new Date(Date.now() + 30 * 1000);
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    },
  },
});
chefSuggestionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const ChefSuggestion = mongoose.model("ChefSuggestion", chefSuggestionSchema);

module.exports = ChefSuggestion;
