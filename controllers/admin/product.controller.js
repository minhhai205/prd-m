const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
// [GET] /admin/products
module.exports.index = async(req, res) => {

  // -Tính năng lọc trạng thái và tìm kiếm
  const filterStatus = filterStatusHelper(req.query);
  const objectSearch = searchHelper(req.query);

  let find = {
    deleted: false
  };

  if(req.query.status){
    find.status = req.query.status;
  }
  
  if(objectSearch.regex){
    find.title = objectSearch.regex;
  }
  // End tính năng lọc trạng thái và tìm kiếm
  
  // Panigation
  let objectPagination = {
    currentPage: 1,
    limitItems: 4
  }

  const countProducts = await Product.countDocuments(find);

  objectPagination = paginationHelper(objectPagination, req.query, countProducts);
  // End Panigation

  const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);

  
  // console.log(products);

  res.render("admin/pages/products/index", {
    pageTitle : "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  });
}