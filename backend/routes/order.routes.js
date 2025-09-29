const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { verifyToken, isAdminOrStaff } = require("../middleware/auth.middleware");

// ➕ Tạo đơn hàng từ giỏ hàng (người dùng)
router.post("/", verifyToken, orderController.createOrder);

// 📋 Lấy tất cả đơn hàng (admin & staff)
router.get("/", verifyToken, isAdminOrStaff, orderController.getAllOrders);

// 👤 Người dùng xem đơn hàng của mình
router.get("/my", verifyToken, orderController.getMyOrders);

// 🔍 Xem chi tiết đơn hàng
router.get("/:id", verifyToken, (req, res, next) => {
  // Nếu là admin hoặc staff => cho qua
  if (req.user.role === "admin" || req.user.role === "staff") {
    return next();
  }
  // Nếu không phải admin/staff => chỉ được xem đơn của chính mình
  req.onlyOwnOrder = true;
  next();
}, orderController.getOrderById);

// 🔄 Cập nhật trạng thái đơn hàng (admin/staff)
router.put("/:id/status", verifyToken, isAdminOrStaff, orderController.updateOrderStatus);

module.exports = router;
