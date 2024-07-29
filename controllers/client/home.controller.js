const Product = require("../../models/product.model");
// [GET] /
module.exports.index = async(req, res) => {
  const productsFeatured = await Product.find({
    deleted: false,
    status: "active",
    featured: "1",
  }).limit(6);

  productsFeatured.forEach(product => {
    product.newPrice = ((1 - product.discountPercentage / 100) * product.price).toFixed(0);
  });

  res.render("client/pages/home/index", {
    pageTitle : "Trang chủ",
    productsFeatured: productsFeatured,
  });
}