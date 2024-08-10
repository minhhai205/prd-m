const dashboardRoutes = require("./dashboard.route");
const systemConfig = require("../../config/system");
const productRoutes = require("./product.route");
const productCategoryRoutes = require("./product-category.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route");
const profileRoutes = require("./profile.route");
const orderRoutes = require("./order.route");

const authMiddleware = require("../../middlewares/admin/auth.middlewares");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  
  app.use(PATH_ADMIN + "/dashboard", authMiddleware.requireAuth, dashboardRoutes);

  app.use(PATH_ADMIN + "/products", authMiddleware.requireAuth, productRoutes);

  app.use(PATH_ADMIN + "/products-category", authMiddleware.requireAuth, productCategoryRoutes);

  app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth, roleRoutes);

  app.use(PATH_ADMIN + "/accounts", authMiddleware.requireAuth, accountRoutes);

  app.use(PATH_ADMIN + "/auth", authRoutes);

  app.use(PATH_ADMIN + "/profile", authMiddleware.requireAuth, profileRoutes);

  app.use(PATH_ADMIN + "/orders", orderRoutes);

}