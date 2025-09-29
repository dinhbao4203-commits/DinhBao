const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("📩 Header nhận được:", authHeader);

  if (!authHeader) {
    console.error("❌ Lỗi: Không tìm thấy Authorization header");
    return res.status(403).json({ message: "Thiếu token xác thực" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.error("❌ Lỗi: Không tìm thấy token sau Bearer");
    return res.status(403).json({ message: "Token không hợp lệ" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("❌ Lỗi verify token:", err.message);
      return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    console.log("✅ Token hợp lệ, dữ liệu decode:", decoded);

    // Đảm bảo req.user có id và role
    if (!decoded.id) {
      console.error("❌ Lỗi: Token không chứa id user");
      return res.status(403).json({ message: "Token thiếu thông tin user" });
    }

    req.user = decoded;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }
  console.error("⛔ Quyền truy cập bị từ chối: Cần admin");
  return res.status(403).json({ message: "Chỉ admin mới được phép truy cập!" });
};

const isAdminOrStaff = (req, res, next) => {
  if (req.user?.role === "admin" || req.user?.role === "staff") {
    return next();
  }
  console.error("⛔ Quyền truy cập bị từ chối: Cần admin hoặc staff");
  return res.status(403).json({ message: "Chỉ admin hoặc staff được phép truy cập!" });
};

module.exports = {
  verifyToken,
  isAdmin,
  isAdminOrStaff
};
