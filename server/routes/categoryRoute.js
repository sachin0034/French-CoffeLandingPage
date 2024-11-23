const router = require("express").Router();
const chefController = require("../controller/categoryContrller");

router.post("/add-category", chefController.addMenu);
router.get("/get-category", chefController.getMenu);
router.put("/update/:id", chefController.getMenuByDate);
router.delete("/delete/:id", chefController.deleteMenu);

module.exports = router;
