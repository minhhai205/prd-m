const Cart = require("../../models/cart.model");

module.exports.cart = async(req, res, next) => {
  if(!req.cookies.cartId){
    const cart = new Cart();
    await cart.save();
    
    res.cookie("cartId", cart.id, {expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 100)});
  }
  else {
    try {
      const cart = await Cart.findOne({
        _id: req.cookies.cartId
      });
  
      res.locals.miniCart = cart;
    } catch (error) {
      req.flash("error", "Bạn vui lòng không chỉnh sửa hệ thống!");
      res.clearCookie("cartId");
    }
  }

  next();
}