const systemConfig = require("../../config/system");
const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/products-category
module.exports.index = async(req, res) => {
  if(!res.locals.role.permissions.includes("products-category_view")) {
    req.flash("error", "");
    req.flash("error", "Bạn không có quyền truy cập trang danh mục sản phẩm!");
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    return;
  }
  let find = {
    deleted: false
  };
  
  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.createTree(records);


  res.render("admin/pages/products-category/index", {
    pageTitle : "Tạo danh mục sản phẩm",
    records: newRecords,
  });
}

// [GET] /admin/products-category/create
module.exports.create = async(req, res) => {
  if(!res.locals.role.permissions.includes("products-category_create")) {
    req.flash("error", "Bạn không có quyền thêm mới danh mục sản phẩm!")
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    return;
  }

  let find = {
    deleted: false,
  }

  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.createTree(records);

  res.render("admin/pages/products-category/create", {
    pageTitle : "Tạo danh mục sản phẩm",
    records: newRecords,
  });
}

// [POST] /admin/products-category/create
module.exports.createPost = async(req, res) => {
  if(req.body.position == ""){
    const count= await ProductCategory.countDocuments();
    req.body.position = count + 1;
  }
  else{
    req.body.position = parseInt(req.body.position);
  }

  const record = new ProductCategory(req.body);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
}