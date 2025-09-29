const express = require("express");
const router = express.Router();
const db = require("../models");
const Product = db.product;
const { Sequelize, Op } = require("sequelize"); // ⬅ Thêm Op từ Sequelize

router.get("/", async (req, res) => {
  try {
    const categories = await Product.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("category")), "category"]
      ],
      where: { category: { [Op.ne]: null } }, // ⬅ Sử dụng Op
      order: [["category", "ASC"]],
    });

    // ⬅ Lấy giá trị category đúng cách
    res.json(categories.map((item) => item.get("category")));
  } catch (err) {
    console.error("Lỗi khi lấy category:", err);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

module.exports = router;
