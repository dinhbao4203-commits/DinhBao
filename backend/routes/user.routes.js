const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

/**
 * Endpoints self-service cho user thường
 * - LẤY thông tin cá nhân đang đăng nhập
 * - CẬP NHẬT thông tin cá nhân (ví dụ: name)
 * Lưu ý: đặt trước "/:id" để tránh xung đột route.
 */
router.get("/me", verifyToken, userController.getMe);
router.put("/me", verifyToken, userController.updateMe);

// Tất cả API user cho admin quản lý
router.get("/", verifyToken, isAdmin, userController.getAllUsers);
router.get("/:id", verifyToken, isAdmin, userController.getUserById);
router.post("/", verifyToken, isAdmin, userController.createUser);
router.put("/:id", verifyToken, isAdmin, userController.updateUser);
router.delete("/:id", verifyToken, isAdmin, userController.deleteUser);

module.exports = router;
