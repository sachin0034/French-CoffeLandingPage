const router = require("express").Router();
const userController = require("../controller/menuController");

router.post("/add", userController.addMenu);

module.exports = router;
