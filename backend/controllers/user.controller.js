const db = require("../models");
const user = db.user;
const bcrypt = require("bcryptjs");

// 📌 Lấy thông tin user đang đăng nhập
exports.getMe = async (req, res) => {
  try {
    const foundUser = await user.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!foundUser) {
      return res.status(404).json({ message: "Không tìm thấy thông tin người dùng" });
    }

    res.json(foundUser);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin cá nhân", error: error.message });
  }
};

// 📌 Cập nhật thông tin user đang đăng nhập
exports.updateMe = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const foundUser = await user
    .findByPk(req.user.id);
    if (!foundUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    let updatedData = { name, email };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(password, salt);
    }

    await foundUser.update(updatedData);
    res.json({ message: "Cập nhật thông tin cá nhân thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật thông tin cá nhân", error: error.message });
  }
};

// 📌 Lấy danh sách user (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await user.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách user", error: error.message });
  }
};

// 📌 Lấy 1 user theo id (Admin)
exports.getUserById = async (req, res) => {
  try {
    const foundUser = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });

    if (!foundUser) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    res.json(foundUser);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy user", error: error.message });
  }
};

// 📌 Tạo user mới (Admin)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ name, email, password" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await user.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "Tạo user thành công",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo user", error: error.message });
  }
};

// 📌 Cập nhật user (Admin)
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const foundUser = await user.findByPk(req.params.id);
    if (!foundUser) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    let updatedData = { name, email, role };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(password, salt);
    }

    await foundUser.update(updatedData);
    res.json({ message: "Cập nhật user thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật user", error: error.message });
  }
};

// 📌 Xóa user (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const foundUser = await user.findByPk(req.params.id);
    if (!foundUser) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    await foundUser.destroy();
    res.json({ message: "Xóa user thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa user", error: error.message });
  }
};
