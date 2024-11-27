const router = require("express").Router();
const menuTimeController = require("../controller/menuTimeController");

router.post("/add-menu", menuTimeController.addMenu);
router.get("/get-menu", menuTimeController.getMenu);
router.put("/update/:id", menuTimeController.getMenuByDate);
router.delete("/delete/:id", menuTimeController.deleteMenu);

module.exports = router;
