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