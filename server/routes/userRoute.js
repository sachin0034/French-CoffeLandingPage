const router = require("express").Router();
const userController = require("../controller/userController");
const authMiddleware = require("../controller/middlewares/authMiddleware");

router.post("/login", userController.login);
router.post("/register", userController.signup);
router.post("/reset-password",userController.resetPassword);

router.post("/forgot-password", userController.forgotPassword);

router.post("/reset-password/:token",  userController.resetPasswordInLoginTime);

router.post("/validateToken", userController.validateToken);
router.delete("/delete-user/:userId", userController.deleteUser);
router.get("/get-user", userController.getUser);

router.get('/profile',   userController.getProfile);
router.put('/updateProfile', authMiddleware, userController.updateProfile);

module.exports = router;
