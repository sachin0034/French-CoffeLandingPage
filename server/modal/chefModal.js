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
});

const ChefSuggestion = mongoose.model("ChefSuggestion", chefSuggestionSchema);

module.exports = ChefSuggestion;
