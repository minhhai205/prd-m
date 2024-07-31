const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

// [GET] /products
module.exports.index = async (req, res) => {

  const products = await Product.find({
    status: "active",
    deleted: false
  }).sort({position: "asc"});

  products.forEach(item => {
    item.priceNew = (item.price * (1 - item.discountPercentage / 100)).toFixed(0);
  });
  // console.log(products);

  res.render("client/pages/products/index",{
    pageTitle : "Trang danh sách sản phẩm",
    products: products
  });
}

// [GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
  try{
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: "active"
    }
    
    const product = await Product.findOne(find);

    product.priceNew = ((1 - product.discountPercentage / 100) * product.price).toFixed(0); 

    const category = ProductCategory.find({
      deleted: false,
      status: "active",
      _id: product.product_category_id,
    });

    product.category = category;

    res.render("client/pages/products/detail", {
      pageTitle : product.title, 
      product: product
    });
  } catch (error) {
    res.redirect(`/products`)
  }
}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  try {
    const productCategory = await ProductCategory.findOne({
      deleted: false,
      status: "active",
      slug: req.params.slugCategory,
    });

    // Tìm các danh mục là con của danh mục productCategory trên
    let categoryIds = [productCategory.id];
    const findIdCategory = async(id) => {
      const list = await ProductCategory.find({
        parent_id: id,
        status: "active",
        deleted: false,
      });
      
      for (const item of list) {
        categoryIds.push(item.id)
        await findIdCategory(item.id);
      }
    }
    await findIdCategory(productCategory.id);
    // console.log(categoryIds);

    const products = await Product.find({
      product_category_id: { $in: [...categoryIds] },
      deleted: false,
      status: "active"
    }).sort({ position: "desc" });
  
    for (const item of products) {
      item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
    }
  
    res.render("client/pages/products/index", {
      pageTitle: productCategory.title,
      products: products,
    });
  } catch (error) {
    res.redirect("back");
  }
}