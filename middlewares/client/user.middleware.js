const User = require("../../models/user.model");
const Cart = require("../../models/cart.model");

module.exports.userInfo = async (req, res, next) => {
  if(req.cookies.tokenUser) {
    const user = await User.findOne({
      tokenUser: req.cookies.tokenUser,
      deleted: false,
      status: "active"
    });

    if(user) {
      res.locals.user = user;
      const cart = await Cart.findOne({user_id : user.id});

      // Nếu user đã có card thì cập nhập lại cardId local
      if(cart){
        res.cookie("cartId", cart.id, {expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 100)}); 
      }
      // Không thì xét card hiện tại cho user
      else{
        await Cart.updateOne({_id : req.cookies.cartId}, {user_id : user.id});
      }
    }
  }

  next();
}