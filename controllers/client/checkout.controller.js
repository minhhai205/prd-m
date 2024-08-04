const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

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

// [POST] /checkout/order
module.exports.order = async(req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const userInfor = req.body;

    const cart = await Cart.findOne({_id : cartId});
    
    const products = [];

    for (const item of cart.products) {
      const product = await Product.findOne({
        _id: item.product_id
      });
  
      const objectProduct = {
        product_id: item.product_id,
        price: product.price,
        discountPercentage: product.discountPercentage,
        quantity: item.quantity,
      };
  
      products.push(objectProduct);
    }

    const dataOrder = {
      // user_id: String,
      cart_id: cartId,
      userInfor: userInfor,
      products: products,
    };
  
    const order = new Order(dataOrder);
    await order.save();
  
    await Cart.updateOne({
      _id: cartId
    }, {
      products: []
    });
  
    res.redirect(`/checkout/success/${order.id}`);
  } catch (error) {
    req.flash("error", "Đạt hàng thất bại!");
    res.redirect("back");
  }
}