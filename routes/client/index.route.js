
const productRoutes = require("./products.route")
const homeRoutes = require("./home.route")
const middlwerreCategory = require("../../middlewares/client/catagory.middleware")
module.exports = (app) => {
  app.use(middlwerreCategory.category);

  app.use("/", homeRoutes)
  // app.get("/", (req, res) =>{
  //   res.render("client/pages/home/index")
  // })
  app.use("/products", productRoutes)
}