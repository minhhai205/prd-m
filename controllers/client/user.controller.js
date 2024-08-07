const md5 = require("md5");
const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password");

const generateHelper = require("../../helpers/generate");
const sendEmailHelper = require("../../helpers/sendEmail");

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
  
    res.cookie("tokenUser", user.tokenUser, {expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 100)});
  
    res.redirect("/");
  }
  
}

// [GET] /user/login
module.exports.login = (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập",
  });
}

// [POST] /user/login
module.exports.loginPost = async(req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false
  });

  if(!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }

  if(md5(password) != user.password) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect("back");
    return;
  }

  if(user.status != "active") {
    req.flash("error", "Tài khoản đang bị khóa!");
    res.redirect("back");
    return;
  }

  res.cookie("tokenUser", user.tokenUser, {expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 100)});

  res.redirect("/");

}

// [GET] /user/logout
module.exports.logout = async(req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/");
}

// [GET] /user/password/forgotPassword
module.exports.forgotPassword = async(req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Lấy lại mật khẩu",
  });
}

// [POST] /user/password/forgotPassword
module.exports.forgotPasswordPost = async(req, res) => {
  const email = req.body.email;

  const user = await User.findOne({email : email});

  if(!user){
    req.flash("error", "Không tồn tại email!");
    res.redirect("back");
    return;
  }

  if(user.status === "inactive") {
    req.flash("error", "Tài khoản đang bị khóa!");
    res.redirect("back");
    return;
  }

  const otp = generateHelper.generateRandomNumber(6);

  //Lưu email, OTP vào database
  const forgotPasswordData = {
    email : email,
    otp : otp,
    expireAt: Date.now() + 30*1000,
  }

  const forgotPassword = new ForgotPassword(forgotPasswordData);
  await forgotPassword.save();

  // Gửi mã OTP qua email của user ???
  const subject = "Lấy lại mật khẩu.";
  const text = `Mã OTP xác thực tài khoản của bạn là: ${otp}.`;
  sendEmailHelper.sendEmail(email, subject, text);

  res.redirect(`/user/password/otp?email=${email}`);
}

// [GET] /user/password/otp
module.exports.otpPassword = async(req, res) => {
  res.render("client/pages/user/otp-password", {
    pageTitle: "Otp",
    email: req.query.email,
  });
}

// [POST] /user/password/otp
module.exports.otpPasswordPost = async(req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  try {
    const data = await ForgotPassword.findOne({
      email: email,
      otp: otp,
    });

    if(!data){
      req.flash("error", "Mã otp không hợp lệ!");
      res.redirect("back");
      return;
    }

    const user = await User.findOne({ email: email });

    res.cookie("tokenUser", user.tokenUser, {expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 100)});

    res.redirect("/user/password/reset");

  } catch (error) {
    req.flash("error", "Vui lòng thử lại!");
    res.redirect("back");
  }
}

// [GET] /user/password/resetPassword
module.exports.resetPassword = async(req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Thay dổi mật khẩu",
  });
}

// [PATCH] /user/password/resetPassword
module.exports.resetPasswordPatch = async(req, res) => {
  const newPassword = req.body.password;
  const tokenUser = req.cookies.tokenUser;

  await User.updateOne({tokenUser: tokenUser}, {password: md5(newPassword)});

  res.redirect("/");
}