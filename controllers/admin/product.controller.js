const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
// [GET] /admin/products
module.exports.index = async(req, res) => {

  // -Tính năng lọc trạng thái
  const filterStatus = filterStatusHelper(req.query);
  // - End tính năng lọc trạng thái


  // Truy vấn data trong database
  let find = {
    deleted: false
  };

  if(req.query.status){
    find.status = req.query.status;
  }
  
  let keyword = "";
  if(req.query.keyword){
    keyword = req.query.keyword;
    const regex = new RegExp(keyword, "i"); // Tim kiếm tối ưu
    find.title = regex;
  }

  const products = await Product.find(find);
  // End truy vấn data

  
  // console.log(products);

  res.render("admin/pages/products/index", {
    pageTitle : "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: keyword
  });
}