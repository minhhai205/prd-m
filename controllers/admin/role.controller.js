const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async(req, res) => {
  let find = {
    deleted: false,
  }

  const records = await Role.find(find);

  res.render("admin/pages/roles/index", {
    pageTitle : "Nhóm quyền",
    records: records,
  });
}

// [GET] /admin/roles/create
module.exports.create = async(req, res) => {

  res.render("admin/pages/roles/create", {
    pageTitle : "Tạo nhóm quyền",
  });
}

// [POST] /admin/roles/create
module.exports.createPost = async(req, res) => {
  const record = new Role(req.body);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/roles`);
  
}

// [GET] /admin/permissions
module.exports.permissions = async(req, res) => {
  let find = {
    deleted: false,
  }

  const records = await Role.find(find);

  res.render("admin/pages/roles/permissions", {
    pageTitle : "Phân quyền",
    records: records,
  });
}

// [PATCH] /admin/permissions
module.exports.permissionsPatch = async(req, res) => {
  try {
    const permissions = JSON.parse(req.body.permissions);
    for (const item of permissions) {
      const id = item.id;
      const permissions = item.permissions;
      await Role.updateOne({_id: id}, {permissions: permissions});
    }
    req.flash("success", "Cập nhập phân quyền thành công");
  } catch (error) {
    req.flash("error", "Cập nhập phân quyền không thành công");
  }
  res.redirect("back");
}