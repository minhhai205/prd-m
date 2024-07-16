const mongoose = require("mongoose");
slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema({
  title: String,
  parent_id: {
    type: String,
    default: "",
  },
  description: String,
  thumbnail: String,
  status: String,
  position: Number,
  slug: { 
    type: String, slug: "title", unique: true },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true //create and update at
});

const productCategory = mongoose.model("ProductCategory", productCategorySchema, "products-category");

module.exports = productCategory;
