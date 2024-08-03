const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

// [GET] /checkout
module.exports.index = async(req, res) => {
  try {
    const cartDetail = await Cart.findOne({_id: req.cookies.cartId});

    cartDetail.totalPrice = 0;

    for(const item of cartDetail.products){
      
      const infoProduct = await Product.findOne({
        _id: item.product_id,
      }).select("title thumbnail discountPercentage price stock slug");
      
      infoProduct.priceNew = ((1 - infoProduct.discountPercentage / 100) * infoProduct.price).toFixed(0);

      item.totalPrice = infoProduct.priceNew * item.quantity;

      item.infoProduct = infoProduct;
      
      cartDetail.totalPrice += item.totalPrice;

    }

    res.render("client/pages/checkout/index", {
      pageTitle: " Đặt hàng",
      cartDetail: cartDetail,
    });
  } catch (error) {
    req.flash("error", "Lỗi thanh toán!");
    res.redirect("back");
  }
}