const Product = require("../../models/product.model");
// [GET] /products
module.exports.index = async (req, res) => {

  const products = await Product.find({
    status: "active",
    deleted: false
  });

  products.forEach(item => {
    item.priceNew = (item.price * (1 - item.discountPercentage / 100)).toFixed(0);
  });
  console.log(products);

  res.render("client/pages/products/index",{
    pageTitle : "Trang danh sách sản phẩm",
    products: products
  });
}