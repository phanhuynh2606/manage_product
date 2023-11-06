const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const FilterStatusHelper = require("../../helpers/filterStatus");
const SearchHelper = require("../../helpers/search");
const filterStatus = require("../../helpers/filterStatus");
const createTreeHelper = require("../../helpers/createTree");
// [GET] /admin/products-category

module.exports.index = async (req, res) => {
  const filterStatus = FilterStatusHelper(req.query);
  const objectSearch = SearchHelper(req.query);
  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  //sort
  const sort = {};
  sort.position = "desc";
  //end sort
  const records = await ProductCategory.find(find).sort(sort);

  const newRecords = createTreeHelper.tree(records);
  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
  });
};
// [PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  console.log(req.params);
  const status = req.params.status;
  const id = req.params.id;
  await ProductCategory.updateOne({ _id: id }, { status: status });
  req.flash("success", "Cập nhật trạng thái thành công");
  res.redirect("back");
};

// [PATCH] /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(",");
  // console.log(ids);
  switch (type) {
    case "active":
      await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash("success", `Cập nhật trạng thái hoạt động cho ${ids.length} sản phẩm`);
      break;
    case "inactive":
      await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash("success", `Cập nhật trạng thái dừng hoạt cho ${ids.length} sản phẩm`);
      break;
    case "delete-all":
      await ProductCategory.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedAt: Date.now(),
        }
      );
      req.flash("success", `Xóa ${ids.length} sản phẩm thành công`);
      break;
    case "change-position":
      for (const item of ids) {
        const [id, position] = item.split("-");
        await ProductCategory.updateOne(
          { _id: id },
          {
            position: position,
          }
        );
      }
      req.flash("success", `Xóa ${ids.length} sản phẩm thành công`);
      break;

    default:
      break;
  }
  res.redirect("back");
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);
  const newRecords = createTreeHelper.tree(records);
  console.log(newRecords);
  res.render("admin/pages/products-category/create", {
    pageTitle: "Tạo danh mục",
    record: newRecords,
  });
};
// [POST] /admin/products-category/create
module.exports.createCategory = async (req, res) => {
  // console.log(res.locals.role.permission);
  const permissions = res.locals.role.permissions;
  if (permissions.includes("products-category_create")) {
    if (req.body.position == "") {
      const countProduct = await ProductCategory.count();
      req.body.position = countProduct + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }
    const record = new ProductCategory(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  } else {
    res.send("403");
    return;
  }
};

// [GET] /admin/products-category/edit/:id

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await ProductCategory.findOne({
      _id: id,
      deleted: false,
    });
    const records = await ProductCategory.find({ deleted: false });
    const newRecords = createTreeHelper.tree(records);
    res.render("admin/pages/products-category/edit", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      data: data,
      records: newRecords,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    req.body.position = parseInt(req.body.position);
    await ProductCategory.updateOne(
      {
        _id: id,
      },
      req.body
    );
    req.flash("success", "Cập nhật thành công");
    res.redirect("back");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại");
  }
};

// [DELETE] /admin/products-category/delete/:id
module.exports.delete = async (req, res) => {
  const id = req.params.id;
  console.log(id);

  try {
    await ProductCategory.updateOne(
      { _id: id },
      {
        deleted: true,
      }
    );
    req.flash("success", "Xóa danh mục thành công");
  } catch (error) {
    req.flash("error", "Xóa danh mục không thành công");
  }
  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};

// [GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const find = {
      deleted: false,
      _id: id,
    };
    const record = await ProductCategory.findOne(find);
    let parentCategory = "";
    if (record.parent_id.length > 0) {
      findCategory = {
        _id: record.parent_id,
      };
      parentCategory = await ProductCategory.findOne(findCategory);
    }
    res.render("admin/pages/products-category/detail", {
      pageTitle: "Chi tiết danh mục sản phẩm",
      record: record,
      parentCategory: parentCategory,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};
