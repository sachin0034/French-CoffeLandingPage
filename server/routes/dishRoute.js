const express = require("express");
const {
  createDish,
  getDishes,
  updateDish,
  deleteDishByDate,
  deleteAllDishesByDate,
  searchMenuByDate,
  uploadMenu,
} = require("../controller/dishController");

const router = express.Router();
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "dish/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// CRUD routes
router.post("/create", createDish);
router.get("/get-dish", getDishes);
router.get("/get-dish-date/:date", searchMenuByDate);
router.put("/edit/:date/:id", updateDish);
router.delete("/delete/:id/:date", deleteDishByDate);
router.delete('/delete-all/:date', deleteAllDishesByDate);
router.post("/menu-file-upload", upload.single("file"), uploadMenu);

module.exports = router;
