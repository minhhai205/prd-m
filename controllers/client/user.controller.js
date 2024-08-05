const md5 = require("md5");
const User = require("../../models/user.model");

const generateHelper = require("../../helpers/generate");

// [GET] /user/register
module.exports.register = (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
}

// [POST] /user/register
module.exports.registerPost = async(req, res) => {
  const existUser = await User.findOne({
    email: req.body.email,
    deleted: false
  });

  if(existUser) {
    req.flash("error", "Email đã tồn tại!");
    res.redirect("back");
  }
  else{
    req.body.password = md5(req.body.password);
    req.body.tokenUser = generateHelper.generateRandomString(20);
    
    const user = new User(req.body);
    await user.save();
  
    res.cookie("tokenUser", user.tokenUser);
  
    res.redirect("/");
  }
  
}