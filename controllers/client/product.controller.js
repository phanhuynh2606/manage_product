// [GET] /products
const productsHelper = require("../../helpers/products");
const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const ProductCategoryHelper = require("../../helpers/getSubCategory");

module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });
  const newProducts = productsHelper.priceNewProducts(products);
  // console.log(newProducts);
  res.render("client/pages/products/index", {
    pageTitle: "Danh Sách Sản Phẩm",
    products: newProducts,
  });
};
// [GET] /products/detail/:slugProduct

module.exports.detail = async (req, res) => {
  try {
    const find = {
      slug: req.params.slugProduct,
      deleted: false,
      status: "active",
    };
    const product = await Product.findOne(find);
    if (product.product_category_id) {
      const category = await ProductCategory.findOne({
        _id: product.product_category_id,
        status: "active",
        deleted: false,
      });

      product.category = category;
    }
    product.priceNew = productsHelper.priceNewProduct(product);
    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`/products}`);
  }
};
// [GET] /products/:slugCategory

module.exports.category = async (req, res) => {

  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    status: "active",
    deleted: false,
  });

  const listSubCategory = await ProductCategoryHelper.getSubCategory(category.id);
  const listSubCategoryId = listSubCategory.map((item) => item.id);
  const products = await Product.find({
    product_category_id: { $in: [category.id, ...listSubCategoryId] },
    deleted: false,
  }).sort({ position: "desc" });
  // console.log(products);
  const newProducts = productsHelper.priceNewProducts(products);
  res.render("client/pages/products/index", {
    pageTitle: `Trang sản phẩm ${category.title}`,
    products: newProducts,
  });
};
