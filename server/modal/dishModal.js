const mongoose = require("mongoose");

const DishSchema = new mongoose.Schema({
  date: { type: Date,  unique: true },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      description: { type: String, required: true },
      dprice:{type:Number,required:true}
    },
  ],
});

const Dish = mongoose.model("Dish", DishSchema);
module.exports = Dish;
