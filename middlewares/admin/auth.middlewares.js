const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const Role = require("../../models/role.model");

module.exports.requireAuth = async(req, res, next) => {
  if(!req.cookies.token){
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } 
  else{
    const user = await Account.findOne({
      deleted: false,
      token: req.cookies.token,
    });
    if(!user){
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
    else{
      const role = await Role.findOne({
        _id: user.role_id,
        deleted: false
      });
    
      res.locals.user = user;
      res.locals.role = role;
      
      next();
    }
  }
}