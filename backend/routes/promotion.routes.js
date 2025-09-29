const express = require("express");
const router = express.Router();
const promotionController = require("../controllers/promotion.controller");

// middleware xác thực + phân quyền
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

// ➕ Tạo khuyến mãi (Chỉ admin)
router.post("/", verifyToken, isAdmin, promotionController.createPromotion);

// 📋 Lấy tất cả khuyến mãi
router.get("/", promotionController.getAllPromotions);

// 🔍 Lấy thông tin 1 khuyến mãi theo ID
router.get("/:id", promotionController.getPromotionById);

// 🖊️ Sửa khuyến mãi (Chỉ admin)
router.put("/:id", verifyToken, isAdmin, promotionController.updatePromotion);

// ❌ Xoá khuyến mãi (Chỉ admin)
router.delete("/:id", verifyToken, isAdmin, promotionController.deletePromotion);

module.exports = router;
