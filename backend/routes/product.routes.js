const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload.middleware");
const { verifyToken } = require("../middleware/auth.middleware");
const { allowRoles } = require("../middleware/role.middleware");

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  reorderImages,
  getHomeSections // 📌 Thêm hàm cho Home
} = require("../controllers/product.controller");

// 📌 API trang Home (Phải đặt trước "/:id" để tránh nhầm lẫn)
router.get("/home-sections", getHomeSections);

// ➕ Tạo sản phẩm (1 ảnh chính)
router.post(
  "/",
  verifyToken,
  allowRoles("admin", "staff"),
  upload.single("image"),
  createProduct
);

// 📋 Lấy tất cả sản phẩm (có ảnh & khuyến mãi)
router.get("/", getAllProducts);

// 🔍 Lấy chi tiết sản phẩm theo ID (bao gồm ảnh phụ)
router.get("/:id", getProductById);

// 🖊️ Cập nhật sản phẩm (ảnh chính)
router.put(
  "/:id",
  verifyToken,
  allowRoles("admin", "staff"),
  upload.single("image"),
  updateProduct
);

// ❌ Xoá sản phẩm
router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin", "staff"),
  deleteProduct
);

// 📸 Upload nhiều ảnh phụ (thêm mới)
router.post(
  "/:id/images",
  verifyToken,
  allowRoles("admin", "staff"),
  upload.array("images", 10),
  uploadProductImages
);

// 🔄 Reorder ảnh phụ (sắp xếp lại)
router.put(
  "/:id/images/reorder",
  verifyToken,
  allowRoles("admin", "staff"),
  reorderImages
);

module.exports = router;
