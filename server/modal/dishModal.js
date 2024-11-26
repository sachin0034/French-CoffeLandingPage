const mongoose = require("mongoose");

const DishSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now, unique: true },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      description: { type: String, required: true },
      discountPrice: { type: Number },
      category: { type: String, enum: ["dish", "dessert"], required: true },
    },
  ],
});

const Dish = mongoose.model("Dish", DishSchema);
module.exports = Dish;
