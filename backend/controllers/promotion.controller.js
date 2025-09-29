const db = require("../models");
const Promotion = db.promotion;

// ➕ Tạo khuyến mãi (admin)
exports.createPromotion = async (req, res) => {
  try {
    const { title, description, discount, startDate, endDate } = req.body;

    if (!title || !discount || !startDate || !endDate) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin khuyến mãi!" });
    }

    const newPromotion = await Promotion.create({
      title,
      description,
      discount,
      startDate,
      endDate
    });

    res.status(201).json({ message: "Tạo khuyến mãi thành công!", promotion: newPromotion });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi tạo khuyến mãi!", error: err.message });
  }
};

// 📋 Lấy tất cả khuyến mãi
exports.getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.findAll({
      order: [["createdAt", "DESC"]]
    });
    res.status(200).json(promotions);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi lấy danh sách khuyến mãi!", error: err.message });
  }
};

// 🔍 Lấy chi tiết một khuyến mãi theo ID
exports.getPromotionById = async (req, res) => {
  try {
    const id = req.params.id;
    const promotion = await Promotion.findByPk(id);

    if (!promotion) {
      return res.status(404).json({ message: "Không tìm thấy khuyến mãi!" });
    }

    res.status(200).json(promotion);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi lấy khuyến mãi!", error: err.message });
  }
};

// 🖊️ Cập nhật khuyến mãi
exports.updatePromotion = async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await Promotion.update(req.body, { where: { id } });

    if (updated === 0) {
      return res.status(404).json({ message: "Không tìm thấy khuyến mãi!" });
    }

    const updatedPromotion = await Promotion.findByPk(id);
    res.status(200).json({ message: "Cập nhật thành công!", promotion: updatedPromotion });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi cập nhật!", error: err.message });
  }
};

// ❌ Xoá khuyến mãi
exports.deletePromotion = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Promotion.destroy({ where: { id } });

    if (deleted === 0) {
      return res.status(404).json({ message: "Không tìm thấy khuyến mãi để xoá!" });
    }

    res.status(200).json({ message: "Xoá khuyến mãi thành công!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi xoá khuyến mãi!", error: err.message });
  }
};
