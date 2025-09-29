const db = require("../models");
const Product = db.product;
const Promotion = db.promotion;
const ProductImage = db.productImage;
const fs = require("fs");
const path = require("path");

// ➕ Tạo sản phẩm
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, promotionId } = req.body;
    let imagePath = null;
    if (req.file) imagePath = "/uploads/" + req.file.filename;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      quantity,
      image: imagePath,
      promotionId: promotionId || null
    });

    res.status(201).json({ message: "Thêm sản phẩm thành công!", product });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi thêm sản phẩm!", error: err.message });
  }
};

// 📋 Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Promotion, as: "promotion", attributes: ["title", "discount", "startDate", "endDate"] },
        { model: ProductImage, as: "images", attributes: ["id", "url", "order"] }
      ],
      order: [["createdAt", "DESC"]]
    });

    const now = new Date();
    const result = products.map((p) => {
      const product = p.toJSON();
      const promo = product.promotion;
      if (promo && new Date(promo.startDate) <= now && new Date(promo.endDate) >= now) {
        product.finalPrice = parseFloat((product.price - product.price * (promo.discount / 100)).toFixed(2));
        product.promotionStatus = "Đang khuyến mãi";
      } else {
        product.finalPrice = product.price;
        product.promotionStatus = "Không áp dụng";
      }
      return product;
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm!", error: err.message });
  }
};

// 🔍 Lấy sản phẩm theo ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Promotion, as: "promotion", attributes: ["title", "discount", "startDate", "endDate"] },
        { model: ProductImage, as: "images", attributes: ["id", "url", "order"] }
      ],
      order: [[{ model: ProductImage, as: "images" }, "order", "ASC"]]
    });

    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });

    const result = product.toJSON();
    const promo = result.promotion;
    const now = new Date();

    if (promo && new Date(promo.startDate) <= now && new Date(promo.endDate) >= now) {
      result.finalPrice = parseFloat((result.price - result.price * (promo.discount / 100)).toFixed(2));
      result.promotionStatus = "Đang khuyến mãi";
    } else {
      result.finalPrice = result.price;
      result.promotionStatus = "Không áp dụng";
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server!", error: err.message });
  }
};

// 🖊️ Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, promotionId } = req.body;
    const id = req.params.id;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });

    let imagePath = product.image;
    if (req.file) imagePath = "/uploads/" + req.file.filename;

    await product.update({
      name,
      description,
      price,
      category,
      quantity,
      image: imagePath,
      promotionId: promotionId || null
    });

    res.status(200).json({ message: "Cập nhật thành công!", product });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật sản phẩm!", error: err.message });
  }
};

// ❌ Xoá sản phẩm
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });

    await product.destroy();
    res.status(200).json({ message: "Đã xoá sản phẩm." });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá sản phẩm!", error: err.message });
  }
};

// 📸 Upload nhiều ảnh phụ
const uploadProductImages = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });

    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Không có ảnh được tải lên!" });
    }

    const currentCount = await ProductImage.count({ where: { productId } });
    const images = files.map((file, index) => ({
      productId,
      url: `/uploads/${file.filename}`,
      order: currentCount + index
    }));

    await ProductImage.bulkCreate(images);
    res.status(201).json({ message: "Upload ảnh thành công!", images });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi upload ảnh phụ!", error: err.message });
  }
};

// 🔄 Reorder ảnh phụ
const reorderImages = async (req, res) => {
  const { id } = req.params;
  const { order } = req.body;

  if (!Array.isArray(order)) {
    return res.status(400).json({ message: "Thiếu thứ tự ảnh mới." });
  }

  try {
    for (let i = 0; i < order.length; i++) {
      await ProductImage.update({ order: i }, { where: { id: order[i], productId: id } });
    }
    res.json({ message: "Đã cập nhật thứ tự ảnh phụ." });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật thứ tự ảnh phụ." });
  }
};

// ❌ Xoá ảnh phụ
const deleteProductImage = async (req, res) => {
  const id = req.params.id;
  try {
    const img = await ProductImage.findByPk(id);
    if (!img) return res.status(404).json({ message: "Không tìm thấy ảnh" });

    const filePath = path.join(__dirname, "..", "public", img.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await img.destroy();
    res.status(200).json({ message: "Đã xoá ảnh" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá ảnh", error: err.message });
  }
};

// 🆕 API cho trang Home
const getHomeSections = async (req, res) => {
  try {
    const now = new Date();

    // Flash sale
    const flashSaleData = await Product.findAll({
      include: [
        {
          model: Promotion,
          as: "promotion",
          where: {
            startDate: { [db.Sequelize.Op.lte]: now },
            endDate: { [db.Sequelize.Op.gte]: now }
          },
          required: true
        },
        { model: ProductImage, as: "images" }
      ],
      order: [["createdAt", "DESC"]],
      limit: 10
    });
    const flashSale = flashSaleData.map((p) => {
      const prod = p.toJSON();
      prod.finalPrice = parseFloat((prod.price - prod.price * (prod.promotion.discount / 100)).toFixed(2));
      return prod;
    });

    // Sản phẩm mới
    const newProductsData = await Product.findAll({
      include: [
        { model: Promotion, as: "promotion", attributes: ["title", "discount", "startDate", "endDate"] },
        { model: ProductImage, as: "images" }
      ],
      order: [["createdAt", "DESC"]],
      limit: 10
    });
    const newProducts = newProductsData.map((p) => {
      const prod = p.toJSON();
      const promo = prod.promotion;
      if (promo && new Date(promo.startDate) <= now && new Date(promo.endDate) >= now) {
        prod.finalPrice = parseFloat((prod.price - prod.price * (promo.discount / 100)).toFixed(2));
      } else {
        prod.finalPrice = prod.price;
      }
      return prod;
    });

    // Sản phẩm sắp hết hàng
    let lowStockData = await Product.findAll({
      where: { quantity: { [db.Sequelize.Op.lt]: 5 } },
      include: [
        { model: Promotion, as: "promotion", attributes: ["title", "discount", "startDate", "endDate"] },
        { model: ProductImage, as: "images" }
      ],
      order: [["quantity", "ASC"]],
      limit: 10
    });

    if (lowStockData.length < 10) {
      const extra = await Product.findAll({
        where: { id: { [db.Sequelize.Op.notIn]: lowStockData.map((p) => p.id) } },
        include: [
          { model: Promotion, as: "promotion", attributes: ["title", "discount", "startDate", "endDate"] },
          { model: ProductImage, as: "images" }
        ],
        order: [["createdAt", "ASC"]],
        limit: 10 - lowStockData.length
      });
      lowStockData = [...lowStockData, ...extra];
    }

    const lowStock = lowStockData.map((p) => {
      const prod = p.toJSON();
      const promo = prod.promotion;
      if (promo && new Date(promo.startDate) <= now && new Date(promo.endDate) >= now) {
        prod.finalPrice = parseFloat((prod.price - prod.price * (promo.discount / 100)).toFixed(2));
      } else {
        prod.finalPrice = prod.price;
      }
      return prod;
    });

    res.json({ flashSale, newProducts, lowStock });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy dữ liệu trang chủ", error: err.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  reorderImages,
  deleteProductImage,
  getHomeSections
};
