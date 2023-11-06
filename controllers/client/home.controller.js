const { priceNewProducts } = require("../../helpers/products");
const Product = require("../../models/product.model");
// [GET] /

module.exports.index = async (req, res) => {
  // Lay ra san pham nôi bat

  const productFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  }).limit(6);
  const newProducts = priceNewProducts(productFeatured);

  // lay ra san pham moi nhat
  const productsNew = await Product.find({
    deleted: false,
    status: "active",
  }).sort({position:"desc"}).limit(6);
  const newProductsNew = priceNewProducts(productsNew);
  // het lay ra san pham moi nhat
  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productFeatured: newProducts,
    newProductsNew: newProductsNew,
  });
};
