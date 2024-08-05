
const productRoutes = require("./products.route")
const homeRoutes = require("./home.route")
const searchRoutes = require("./search.route")
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");

const middlwerreCategory = require("../../middlewares/client/catagory.middleware")
const middlwerreCart = require("../../middlewares/client/cart.middleware");

module.exports = (app) => {
  app.use(middlwerreCategory.category);

  app.use(middlwerreCart.cart);

  app.use("/", homeRoutes)
  
  app.use("/products", productRoutes)

  app.use("/search", searchRoutes)

  app.use("/cart", cartRoutes);

  app.use("/checkout", checkoutRoutes);

  app.use("/user", userRoutes);
}