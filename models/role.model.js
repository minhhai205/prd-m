const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  title: String,
  description: String,
  permisions: {
    type: Array,
    default: [],
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true //create and update at
});

const Role = mongoose.model("Role", roleSchema, "roles");

module.exports = Role;
