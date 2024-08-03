const mongoose = require("mongoose");

const oderSchema = new mongoose.Schema({
  user_id: String,
  card_id: String,
  userInfor: {
    fullName: String,
    phone: String,
    address: String,
  },
  products: [
    {
      product_id: String,
      price: Number,
      discountPercentage: Number,
      quantity: Number,
    },
  ],
}, 
{
  timestamps: true 
});

const Order = mongoose.model("Order", orderSchema, "oders");

module.exports = Order;
