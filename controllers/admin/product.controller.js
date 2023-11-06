// [GET] /admin/products
const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const FilterStatusHelper = require("../../helpers/filterStatus");
const SearchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");

module.exports.index = async (req, res) => {
  // Đoạn bộ lọc
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
  // Pagination
  const countProducts = await Product.count(find);

  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProducts
  );

  //End Pagination
  //sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // console.log(sort);
  //end sort
  // console.log(objectPagination);
  const products = await Product.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);

  for (const product of products) {
    //retrieve creator information
    const user = await Account.findOne({
      _id: product.createBy.account_id,
    });
    if (user) {
      product.accountFullName = user.fullName;
    }
    // retrieve the information in the recent most updated
    const updateBy = product.updatedBy.slice(-1)[0];
    if(updateBy){
      const userUpdated = await Account.findOne({
        _id : updateBy.account_id
      });
      updateBy.accountFullName = userUpdated.fullName;
    }

  }

  res.render("admin/pages/products/index", {
    pageTitle: "Trang Sản Phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/products/change-status/:status/:id

module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  await Product.updateOne(
    { _id: id },
    {
      status: status,
      $push: {
        updatedBy: updatedBy,
      },
    }
  );

  req.flash("success", "Cập nhật trạng thái thành công");
  res.redirect("back");
};
// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(",");
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };
  switch (type) {
    case "active":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          status: "active",
          $push: {
            updatedBy: updatedBy,
          },
        }
      );
      req.flash("success", `Cập nhật trạng thái hoạt động ${ids.length} sản phẩm thành công`);

      break;
    case "inactive":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          status: "inactive",
          $push: {
            updatedBy: updatedBy,
          },
        }
      );
      req.flash("success", `Cập nhật trạng thái dừng hoạt động ${ids.length} sản phẩm thành công`);

      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          // deleted: true,
          // deletedAt: new Date(),
          deleted: true,
          deleteBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
          },
        }
      );
      req.flash("success", `Xóa ${ids.length} sản phẩm thành công`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne(
          { _id: id },
          {
            position: position,
            $push: {
              updatedBy: updatedBy,
            },
          }
        );
        req.flash("success", `Thay đổi vị trí ${ids.length} sản phẩm thành công`);
      }
      break;
    default:
      break;
  }
  res.redirect("back");
};

// [DELETE] /admin/products/delete/id

module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  // await Product.deleteOne({ _id: id });
  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deleteBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date(),
      },
    }
  );
  req.flash("success", "Xóa thành công 1 sản phẩm");
  res.redirect("back");
};

// [GET] /admin/products/create/
module.exports.create = async (req, res) => {
  const category = await ProductCategory.find({ deleted: false });
  const newCategory = createTreeHelper.tree(category);
  res.render(`admin/pages/products/create`, {
    pageTitle: "Thêm mới sản phẩm",
    category: newCategory,
  });
};

// [POST] /admin/products/create/
module.exports.createPost = async (req, res) => {
  console.log(req.file);
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProduct = await Product.count();
    req.body.position = countProduct + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  req.body.createBy = {
    account_id: res.locals.user.id,
  };
  // if (req.file) {
  //   req.body.thumbnail = `/uploads/${req.file.filename}`;
  // }
  const product = new Product(req.body);
  await product.save();

  req.flash("success", "Tạo thành công sản phẩm");
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const category = await ProductCategory.find({ deleted: false });
    const newCategory = createTreeHelper.tree(category);
    const product = await Product.findOne(find);
    console.log(product);
    res.render(`admin/pages/products/edit`, {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      category: newCategory,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin / products}`);
  }
};

module.exports.editPatch = async (req, res) => {
  console.log(req.body);
  const id = req.params.id;
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  req.body.position = parseInt(req.body.position);
  // if (req.file) {
  //   req.body.thumbnail = `/uploads/${req.file.filename}`;
  // }
  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };

    await Product.updateOne(
      { _id: id },
      {
        ...req.body,
        $push: {
          updatedBy: updatedBy,
        },
      }
    );
    req.flash("success", "Cập nhật thành công");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại");
  }
  res.redirect("back");
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find);
    // console.log(product);
    res.render(`admin/pages/products/detail`, {
      pageTitle: "Chi tiết sản phẩm",
      product: product,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin / products}`);
  }
};
