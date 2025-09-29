const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const db = require("../models");
const User = db.user;

// Route đăng ký
router.post("/register", register);

// Route đăng nhập
router.post("/login", login);

// ✅ Route lấy thông tin người dùng đang đăng nhập
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email"], // thêm "phone" nếu bạn có cột này
    });

    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

module.exports = router;
