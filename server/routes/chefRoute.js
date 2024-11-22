const router = require("express").Router();
const chefController = require("../controller/chefController");

router.post("/add-chef", chefController.addMenu);
router.get("/get-chef", chefController.getMenu);
router.put("/update/:id", chefController.getMenuByDate);
router.delete("/delete/:id", chefController.deleteMenu);

module.exports = router;
