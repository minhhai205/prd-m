const Cart = require("../../models/cart.model");

module.exports.add = async(req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  //try {
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
  // } catch (error) {
  //   console.log("error add product");
  // }
  res.redirect("back");
}