
const productRoutes = require("./products.route")
const homeRoutes = require("./home.route")
const searchRoutes = require("./search.route")
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");

const middlewareCategory = require("../../middlewares/client/catagory.middleware")
const middlewareCart = require("../../middlewares/client/cart.middleware");
const middlewareUser = require("../../middlewares/client/user.middleware");

module.exports = (app) => {
  app.use(middlewareCategory.category);

  app.use(middlewareCart.cart);

  app.use(middlewareUser.userInfo);

  app.use("/", homeRoutes)
  
  app.use("/products", productRoutes)

  app.use("/search", searchRoutes)

  app.use("/cart", cartRoutes);

  app.use("/checkout", checkoutRoutes);

  app.use("/user", userRoutes);
}