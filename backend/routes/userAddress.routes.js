const router = require("express").Router();
const addressController = require("../controllers/userAddress.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// ✅ Lấy địa chỉ của user đang đăng nhập (đặt TRƯỚC /:id để không bị nuốt route)
router.get("/my", verifyToken, addressController.getMyAddresses);

// (tuỳ chọn) Lấy tất cả địa chỉ của user (cũng là của chính mình)
router.get("/", verifyToken, addressController.getMyAddresses);

// ✅ Thêm địa chỉ mới
router.post("/", verifyToken, addressController.addAddress);

// ✅ Cập nhật địa chỉ
router.put("/:id", verifyToken, addressController.updateAddress);

// ✅ Xoá địa chỉ
router.delete("/:id", verifyToken, addressController.deleteAddress);

// ✅ Lấy 1 địa chỉ theo ID (đặt SAU /my)
router.get("/:id", verifyToken, addressController.getAddressById);

module.exports = router;
