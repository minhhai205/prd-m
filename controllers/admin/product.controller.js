const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
// [GET] /admin/products
module.exports.index = async(req, res) => {

  // -Tính năng lọc trạng thái
  const filterStatus = filterStatusHelper(req.query);
  const objectSearch = searchHelper(req.query);
  // - End tính năng lọc trạng thái


  // Truy vấn data trong database
  let find = {
    deleted: false
  };

  if(req.query.status){
    find.status = req.query.status;
  }
  
  if(objectSearch.regex){
    find.title = objectSearch.regex;
  }

  const products = await Product.find(find);
  // End truy vấn data

  
  // console.log(products);

  res.render("admin/pages/products/index", {
    pageTitle : "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword
  });
}