const express = require("express");
const router = express.Router();
const multer = require("multer");
const validate = require("../../validaters/admin/product-category.validate");

const upload = multer();
const uploadStream = require("../../middlewares/admin/uploadCloud.middleware");
const controller = require("../../controllers/admin/product-category.controller");
router.get("/", controller.index);
router.get("/create", controller.create);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.post("/create", upload.single("thumbnail"), uploadStream.upload, validate.creatPost, controller.createCategory);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", upload.single("thumbnail"), uploadStream.upload, validate.creatPost, controller.editPatch);
router.delete("/delete/:id",controller.delete)
router.get("/detail/:id",controller.detail)
module.exports = router;
