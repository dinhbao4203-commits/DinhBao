const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth.middleware");
const { allowRoles } = require("../middleware/role.middleware");
const { deleteProductImage } = require("../controllers/product.controller");

// ❌ Xoá ảnh phụ theo ID
router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin", "staff"),
  deleteProductImage
);

module.exports = router;
