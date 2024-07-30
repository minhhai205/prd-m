
const productRoutes = require("./products.route")
const homeRoutes = require("./home.route")
const searchRoutes = require("./search.route")
const middlwerreCategory = require("../../middlewares/client/catagory.middleware")
module.exports = (app) => {
  app.use(middlwerreCategory.category);

  app.use("/", homeRoutes)
  
  app.use("/products", productRoutes)

  app.use("/search", searchRoutes)
}