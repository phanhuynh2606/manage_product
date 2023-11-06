const systemConfig = require("../../config/system");

const dashboardRouters = require("./dashboard.route");
const productRouters = require("./product.route");
const productCategory = require("./products-category.route");
const roleRouters = require("./role.router");
const accountRouters = require("./accounts.route");
const authRouters= require("../../routes/admin/auth.route");
const myAccountRouters= require("../../routes/admin/my-account.route");
const authMiddleware = require("../../middlewares/admin/auth.middleware");
const settingstRouters = require("./setting.route");
module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(PATH_ADMIN + "/dashboard",authMiddleware.requireAuth ,dashboardRouters);

  app.use(PATH_ADMIN + "/products", authMiddleware.requireAuth, productRouters);

  app.use(PATH_ADMIN + "/products-category",authMiddleware.requireAuth, productCategory);

  app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth, roleRouters);
  
  app.use(PATH_ADMIN + "/accounts", authMiddleware.requireAuth, accountRouters);

  app.use(PATH_ADMIN + "/auth", authRouters);
  
  app.use(PATH_ADMIN + "/my-account", authMiddleware.requireAuth, myAccountRouters);
  
  app.use(PATH_ADMIN + "/settings", authMiddleware.requireAuth, settingstRouters);
};
