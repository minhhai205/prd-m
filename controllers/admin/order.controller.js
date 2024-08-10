const Order = require("../../models/order.model");
const Product = require("../../models/product.model");

const moment = require("moment");

module.exports.index = async(req, res) => {
  const orders = await Order.find({});

  for(const order of orders){
    order.totalPrice = 0;
    for(const item of order.products){
      const product = await Product.findOne({_id: item.product_id}).select("title thumbnail");

      item.productInfo = product;

      order.totalPrice += item.quantity * (item.price * (100 - item.discountPercentage)/100).toFixed(0);
    }

    order.createdAtFormat = moment(order.createdAt).format("DD/MM/YY HH:mm:ss");
  }

  res.render("admin/pages/orders/index", {
    pageTitle: "Đơn hàng",
    orders: orders,
  });
}