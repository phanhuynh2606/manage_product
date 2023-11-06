const express = require("express");
const router = express.Router();
const multer = require("multer");
// const storageMulter = require("../../helpers/storageMulter");
const validate = require("../../validaters/admin/product.validate");

// const upload = multer({ storage: storageMulter() });\

const upload = multer();
const uploadStream = require("../../middlewares/admin/uploadCloud.middleware");
// [GET] /admin/products
const controller = require("../../controllers/admin/product.controller");
router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteItem);
router.get("/create", controller.create);
router.post("/create", upload.single("thumbnail"), uploadStream.upload, validate.creatPost, controller.createPost);

router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", upload.single("thumbnail"), uploadStream.upload, validate.creatPost, controller.editPatch);
router.get("/detail/:id", controller.detail);

module.exports = router;
