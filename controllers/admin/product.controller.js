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

// [PATH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async(req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({_id: id}, {status: status}); // cập nhập database
  
  res.redirect("back"); // tự động chuyên hướng về lại trang trc đó
} 

// [PATH] /admin/products/change-multi
module.exports.changeMulti = async(req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type){
    case "active":
      await Product.updateMany({_id:  { $in: ids} }, { status: "active"});
      break;
    case "inactive":
      await Product.updateMany({_id:  { $in: ids} }, { status: "inactive"});
      break;
    default:
      break;
  }

  res.redirect("back");
} 

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async(req, res) => {
  const id = req.params.id;

  // await Product.deleteOne({_id: id}); // Xóa vĩnh viễn

  await Product.updateOne({_id: id}, {
    deleted: true,
    deletedAt: new Date()
  }); // Xóa mềm
  
  res.redirect("back"); 
} 