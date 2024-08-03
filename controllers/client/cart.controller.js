const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

// [POST] /cart/add/:productId
module.exports.add = async(req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  try {
    const cart = await Cart.findOne({_id : cartId});

    const productInCart = cart.products.find(item => item.product_id == productId);

    if(productInCart){
      const quantityNew = quantity + productInCart.quantity;

      await Cart.updateOne({
        _id: cartId,
        "products.product_id": productId,
      },{
        $set: {"products.$.quantity": quantityNew}
      });
    }

    else{
      const objectCart = {
        product_id: productId,
        quantity: quantity,
      };

      await Cart.updateOne({
        _id: cartId
      }, {
        $push: { products: objectCart }
      });
    }
    req.flash("success", "Đã thêm sản phẩm vào giỏ hàng.");
  } catch (error) {
    req.flash("error", "Thêm sản phẩm vào giỏ hàng thất bại!");
  }
  res.redirect("back");
}

// [GET] /cart
module.exports.index = async(req, res) => {
  try {
    const cartDetail = await Cart.findOne({
      _id: req.cookies.cartId,
    })
    
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
    
    res.render("client/pages/cart/index", {
      pageTitle: "Giỏ hàng",
      cartDetail: cartDetail,
    });
  } catch (error) {
    res.redirect("back");
  }
}

// [DELETE] /cart/delete/product_id:
module.exports.delete = async(req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const productId = req.params.product_id;

    await Cart.updateOne({ _id: cartId }, {
      $pull: { products: { product_id: productId } }
    });
    
  } catch (error) {
    req.flash("error", "Xóa sản phẩm thất bại!");
  }

  res.redirect("back");
}

// [GET] /cart/update/:product_id/:quantity
module.exports.update = async(req, res) => {
  try {
    const productId = req.params.product_id;
    const quantity = req.params.quantity;
    const cartId = req.cookies.cartId;

    await Cart.updateOne({
      _id: cartId,
      "products.product_id": productId,
    },{
      $set: {"products.$.quantity": quantity}
    });
  } catch (error) {
    req.flash("error", "update sản phẩm thật bại!");
  }

  res.redirect("back");
}