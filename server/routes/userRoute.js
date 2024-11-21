const router = require("express").Router();
const userController = require("../controller/userController");

router.post("/login", userController.login);
router.post("/register", userController.signup);
router.post("/validateToken", userController.validateToken);

module.exports = router;
