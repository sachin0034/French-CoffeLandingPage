const express = require("express");
const {
  createDish,
  getDishes,
  getDishById,
  updateDish,
  deleteDishByDate,
  searchMenuByDate,
} = require("../controller/dishController");

const router = express.Router();

// CRUD routes
router.post("/create", createDish);
router.get("/get-dish", getDishes);
router.get("/get-dish-date/:date", searchMenuByDate);
router.put("/edit/:date/:id", updateDish);
router.delete("/delete/:id/:date", deleteDishByDate);

module.exports = router;
