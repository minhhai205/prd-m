const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");
const moment = require("moment");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const createTreeHelper = require("../../helpers/createTree");
// [GET] /admin/products
module.exports.index = async(req, res) => {
  if(!res.locals.role.permissions.includes("products_view")) {
    req.flash("error");
    req.flash("error", "Bạn không có quyền truy cập trang sản phẩm!");
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    return;
  }

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
    limitItems: 8
  }

  const countProducts = await Product.countDocuments(find);

  objectPagination = paginationHelper(objectPagination, req.query, countProducts);
  // End Panigation

  // Sort
  let sort = {};

  if(req.query.sortKey && req.query.sortValue){
    sort[req.query.sortKey] = req.query.sortValue;
  }
  else{
    sort.position = "desc";
  }
  // End Sort

  const products = await Product.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);

  for(const item of products){
    // Creator
    if(item.createdBy){
      const accountCreated = await Account.findOne({
        _id: item.createdBy,
      });
      item.createdByFullName = accountCreated.fullName;
    }
    else{
      item.createdByFullName = "";
    }

    item.createdAtFormat = moment(item.createdAt).format("DD/MM/YY HH:mm:ss");

    // Updater
    if(item.updatedBy) {
      const accountUpdated = await Account.findOne({
        _id: item.updatedBy
      });
      item.updatedByFullName = accountUpdated.fullName;
    } else {
      item.updatedByFullName = "";
    }

    item.updatedAtFormat = moment(item.updatedAt).format("DD/MM/YY HH:mm:ss");
  }


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
  if(!res.locals.role.permissions.includes("products_edit")) {
    req.flash("error", "Bạn không có quyền chỉnh sửa sản phẩm!");
    res.redirect("back");
    return;
  }
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({_id: id}, {status: status}); // cập nhập database
  
  req.flash("success", "Cập nhập trạng thái sản phẩm thành công!");
  
  res.redirect("back"); // tự động chuyên hướng về lại trang trc đó
} 

// [PATH] /admin/products/change-multi
module.exports.changeMulti = async(req, res) => {
  if(!res.locals.role.permissions.includes("products_edit")) {
    req.flash("error", "Bạn không có quyền chỉnh sửa sản phẩm!");
    res.redirect("back");
    return;
  }
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type){
    case "active":
      await Product.updateMany({_id:  { $in: ids} }, { status: "active"});
      req.flash("success", "Cập nhập trạng thái sản phẩm thành công!");
      break;
    case "inactive":
      await Product.updateMany({_id:  { $in: ids} }, { status: "inactive"});
      req.flash("success", "Cập nhập trạng thái sản phẩm thành công!");
      break;
    case "delete-all":
      await Product.updateMany({_id:  { $in: ids} }, { 
        deleted: true,
        deletedAt: new Date()
      });
      req.flash("success", "Xóa sản phẩm thành công!");
      break;
    case "change-position":
      for(const item of ids){
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne({_id: id}, {position: position}); 
      }
      req.flash("success", "Thay đổi vị trí sản phẩm thành công!");
      break;
    default:
      break;
  }

  res.redirect("back");
} 

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async(req, res) => {
  if(!res.locals.role.permissions.includes("products_edit")) {
    req.flash("error", "Bạn không có quyền chỉnh sửa sản phẩm!");
    res.redirect("back");
    return;
  }
  const id = req.params.id;

  // await Product.deleteOne({_id: id}); // Xóa vĩnh viễn

  await Product.updateOne({_id: id}, {
    deleted: true,
    deletedBy: res.locals.account.id,
    deletedAt: new Date()
  }); // Xóa mềm

  req.flash("success", "Xóa sản phẩm thành công!");

  res.redirect("back"); 
} 

// [GET] /admin/products/create
module.exports.create = async(req, res) => {
  if(!res.locals.role.permissions.includes("products_create")) {
    req.flash("error", "Bạn không có quyền thêm mới sản phẩm!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
    return;
  }
  let find = {
    deleted: false
  };
  
  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.createTree(records);

  res.render("admin/pages/products/create", {
    pageTitle : "Thêm mới sản phẩm",
    productsCategory: newRecords,
  });
}

// [POST] /admin/products/create
module.exports.createPost = async(req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if(req.body.position == ""){
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  }
  else{
    req.body.position = parseInt(req.body.position);
  }

  req.body.createdBy = res.locals.user.id;

  const product = new Product(req.body);
  await product.save();

  res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// [GET] /admin/products/edit/:id
module.exports.edit = async(req, res) => {
  if(!res.locals.role.permissions.includes("products_edit")) {
    req.flash("error", "Bạn không có quyền chỉnh sửa sản phẩm!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
    return;
  }
  try{
    const find = {
      deleted: false,
      _id: req.params.id
    }
  
    const product = await Product.findOne(find);
    
    const records = await ProductCategory.find({
      deleted: false
    });
  
    const newRecords = createTreeHelper.createTree(records);
    
    res.render("admin/pages/products/edit", {
      pageTitle : "Chỉnh sửa sản phẩm", 
      productsCategory: newRecords,
      product: product
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  }
}

// // [PATCH] /admin/products/edit/:id
module.exports.editPatch = async(req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);
  req.body.updatedBy = res.locals.user.id;

  try {
    await Product.updateOne({_id: req.params.id}, req.body);
    req.flash("success", "Cập nhập sản phẩm thành công!");
  } catch (error) {
    req.flash("error", "Cập nhập sản phẩm thất bại!");
  }

  res.redirect("back");
}

// [GET] /admin/products/detail/:id
module.exports.detail = async(req, res) => {
  try{
    const find = {
      deleted: false,
      _id: req.params.id
    }
    
    const product = await Product.findOne(find);

    res.render("admin/pages/products/detail", {
      pageTitle : "Chi tiết sản phẩm", 
      product: product
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  }
}