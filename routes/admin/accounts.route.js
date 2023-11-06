const express = require("express");
const router = express.Router();
const multer = require("multer");

const controller = require("../../controllers/admin/account.controller");
const upload = multer();
const uploadStream = require("../../middlewares/admin/uploadCloud.middleware");
const validater = require("../../validaters/admin/account.validate")
//[GET/admin/accounts
router.get("/",controller.index);

router.get("/create",controller.create);

router.post("/create", upload.single("avatar"), uploadStream.upload, validater.creatPost, controller.createPost);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id", upload.single("avatar"), uploadStream.upload, validater.editPatch, controller.editPatch);

module.exports = router;