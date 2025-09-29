const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// ➕ Thêm sản phẩm vào giỏ
router.post("/", verifyToken, cartController.addToCart);

// 📋 Xem giỏ hàng
router.get("/", verifyToken, cartController.getCart);

// 🖊️ Cập nhật số lượng
router.put("/:id", verifyToken, cartController.updateCartItem);

// ❌ Xoá sản phẩm khỏi giỏ
router.delete("/:id", verifyToken, cartController.deleteCartItem);

module.exports = router;
