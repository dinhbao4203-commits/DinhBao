const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = db.user;

// Đăng ký người dùng
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng." });
    }

    // Tạo user mới (bcrypt đã được dùng trong hook model)
    const newUser = await User.create({ name, email, password, role });

    res.status(201).json({ message: "Đăng ký thành công!", user: { id: newUser.id, name, email, role } });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server!", error: err.message });
  }
};

// Đăng nhập
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kiểm tra user tồn tại
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại!" });

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Sai mật khẩu!" });

    // Tạo JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server!", error: err.message });
  }
};

module.exports = { register, login };
