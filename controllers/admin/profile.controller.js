const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const Role = require("../../models/role.model");
const md5 = require('md5');

// [GET] /admin/profile
module.exports.index = async(req, res) => {

  res.render("admin/pages/profile/index", {
    pageTitle : "Thông tin user",
  });
}

// [GET] /admin/profile/edit/
module.exports.edit = async(req, res) => {
  try{
    const find = {
      deleted: false,
      _id: res.locals.user.id,
    }
  
    const account = await Account.findOne(find);
    
    const roles = await Role.find({
      deleted: false
    });
    
    res.render("admin/pages/profile/edit", {
      pageTitle : "Chỉnh sửa tài khoản",
      account: account,
      roles: roles,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/profile`)
  }
}

// [PATCH] /admin/profile/edit/
module.exports.editPatch = async(req, res) => {
  const emailExit = await Account.findOne({
    _id: { $ne: res.locals.user.id}, 
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
      await Account.updateOne({_id: res.locals.user.id}, req.body);
      req.flash("success", "Cập nhập tài khoản thành công!");
    } catch (error) {
      req.flash("error", "Cập nhập tài khoản thất bại!");
    }
  
    res.redirect("back");
  }
  
}