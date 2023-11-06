const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/user.controller");
const validate = require("../../validaters/client/user.validate");
const authenMiddleware = require("../../middlewares/client/auth.middleware");
router.get("/register", controller.register);
router.get("/login", controller.login);
router.post("/register", validate.registerPost, controller.registerPost);
router.post("/login", validate.loginPost, controller.loginPost);
router.get("/logout", controller.logout);
router.get("/password/forgot", controller.forgotPassword);
router.post("/password/forgot", validate.forgotPassword, controller.forgotPasswordPost);
router.get("/password/otp", controller.otpPassword);
router.post("/password/otp", controller.otpPasswordPost);
router.get("/password/reset", controller.resetPassword);
router.post("/password/reset", validate.resetPassword, controller.resetPasswordPost);
router.get("/info",authenMiddleware.requireAuth ,controller.info);

module.exports = router;
