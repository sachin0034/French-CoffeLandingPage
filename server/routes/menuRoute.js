const router = require("express").Router();
const menuController = require("../controller/menuController");

router.post("/add-single", menuController.addMenu);
router.get("/get-menu", menuController.getMenu);
router.get("/:date", menuController.getMenuByDate);
router.delete("/delete/:id/:date", menuController.deleteMenu);
router.put("/edit/:date/:id", menuController.editMenu);
router.put("/prev/:recentdate", menuController.addPrevMenu);

module.exports = router;
