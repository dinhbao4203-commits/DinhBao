const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Đảm bảo thư mục 'uploads/' tồn tại
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Cấu hình nơi lưu file và cách đặt tên
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "_" + file.originalname;
    cb(null, uniqueName);
  }
});

// (Tùy chọn) Bộ lọc định dạng ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ cho phép upload ảnh jpeg, jpg, png, webp!"));
  }
};

// Khởi tạo middleware upload
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // tối đa 5MB mỗi ảnh
});

module.exports = upload;
