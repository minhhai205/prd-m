const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const Role = require("../../models/role.model");
const md5 = require('md5');

// [GET] /admin/accounts
module.exports.index = async(req, res) => {
  let find = {
    deleted: false,
  }

  const records = await Account.find(find).select("-password -token");

  for(const record of records){
    const role = await Role.findOne({
      deleted: false,
      _id: record.role_id,
    });
    record.role = role;
  }
  
  res.render("admin/pages/accounts/index", {
    pageTitle : "Danh sách tài khoản",
    records: records,
  });
}

// [GET] /admin/accounts/create
module.exports.create = async(req, res) => {
  const roles = await Role.find({
    deleted: false,
  });

  res.render("admin/pages/accounts/create", {
    pageTitle : "Tạo tài khoản",
    roles: roles,
  });
}

// [POST] /admin/accounts/create
module.exports.createPost = async(req, res) => {
  // check email đã được sử dụng chưa
  const emailExit = await Account.findOne({ 
    email: req.body.email,
    deleted: false
  });
  
  if(emailExit){
    req.flash("error", "Email đã tồn tại, vui lòng tạo lại tài khoản!");
    res.redirect("back");
  }
  else{
    req.body.password = md5(req.body.password); // ma hóa mật khẩu

    const record = new Account(req.body);
    await record.save();
    
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }

}

// [GET] /admin/accounts/edit/:id
module.exports.edit = async(req, res) => {
  try{
    const find = {
      deleted: false,
      _id: req.params.id
    }
  
    const account = await Account.findOne(find);
    
    const roles = await Role.find({
      deleted: false
    });
    
    res.render("admin/pages/accounts/edit", {
      pageTitle : "Chỉnh sửa tài khoản",
      account: account,
      roles: roles,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`)
  }
}

// // [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async(req, res) => {
  const emailExit = await Account.findOne({
    _id: { $ne: req.params.id}, 
    email: req.body.email,
    deleted: false
  });
  
  if(emailExit){
    req.flash("error", "Email đã tồn tại, vui lòng thử lại!");
    res.redirect("back");
  }
  else{
    if(req.body.password){
      req.body.password = md5(req.body.password);
    } 
    else{
      delete req.body.password;
    }
    
    try {
      await Account.updateOne({_id: req.params.id}, req.body);
      req.flash("success", "Cập nhập tài khoản thành công!");
    } catch (error) {
      req.flash("error", "Cập nhập tài khoản thất bại!");
    }
  
    res.redirect("back");
  }
  
}