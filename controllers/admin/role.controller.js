const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async(req, res) => {
  if(!res.locals.role.permissions.includes("roles_view")) {
    req.flash("error", "");
    req.flash("error", "Bạn không có quyền truy cập trang phân quyền!");
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    return;
  }
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
  if(!res.locals.role.permissions.includes("roles_creat")) {
    req.flash("error", "Bạn không có quyền thêm mới nhóm quyền!");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
    return;
  }

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

// [GET] /admin/roles/permissions
module.exports.permissions = async(req, res) => {
  if(!res.locals.role.permissions.includes("roles_permisions")) {
    req.flash("error", "Bạn không có quyền truy cập trang phân quyền!");
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    return;
  }
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