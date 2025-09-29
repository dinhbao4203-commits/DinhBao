const db = require("../models");
const Cart = db.cart;
const Product = db.product;
const Promotion = db.promotion;
const ProductImage = db.productImage;
const User = db.user;
const UserAddress = db.userAddress;

// ➕ Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({ message: "Thiếu thông tin sản phẩm hoặc số lượng!" });
  }

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
    }

    const existing = await Cart.findOne({ where: { userId, productId } });

    if (existing) {
      existing.quantity += parseInt(quantity);
      await existing.save();
      return res.status(200).json({ message: "Đã cập nhật số lượng!", cartItem: existing });
    }

    const newItem = await Cart.create({ userId, productId, quantity });
    res.status(201).json({ message: "Đã thêm vào giỏ hàng!", cartItem: newItem });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi thêm vào giỏ hàng!", error: err.message });
  }
};

// 📋 Lấy giỏ hàng theo user (tính giá khuyến mãi + địa chỉ mặc định)
const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const items = await Cart.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: "Product", // ✅ alias khớp models/index.js
          include: [
            {
              model: Promotion,
              as: "promotion",
              attributes: ["title", "discount", "startDate", "endDate"],
            },
            {
              model: ProductImage,
              as: "images",
              attributes: ["url", "order"],
            },
          ],
        },
        {
          model: User,
          as: "user", // ✅ alias khớp models/index.js
          attributes: ["id", "name", "email"],
          include: [
            {
              model: UserAddress,
              as: "addresses",
              where: { isDefault: true },
              required: false,
            },
          ],
        },
      ],
    });

    const now = new Date();
    let total = 0;

    const result = items.map((item) => {
      const cart = item.toJSON();
      const product = cart.Product;

      if (!product) {
        cart.note = "Sản phẩm không còn tồn tại!";
        return cart;
      }

      // ✅ Tính giá khuyến mãi
      const promo = product.promotion;
      let finalPrice = product.price;
      if (
        promo &&
        new Date(promo.startDate) <= now &&
        new Date(promo.endDate) >= now
      ) {
        finalPrice = parseFloat(
          (product.price - product.price * (promo.discount / 100)).toFixed(2)
        );
      }

      product.finalPrice = finalPrice;
      cart.subTotal = parseFloat((finalPrice * cart.quantity).toFixed(2));
      total += cart.subTotal;

      return cart;
    });

    res.status(200).json({
      items: result,
      totalPrice: total.toFixed(2),
      defaultAddress: items[0]?.user?.addresses?.[0] || null,
    });
  } catch (err) {
    console.error("❌ Lỗi khi lấy giỏ hàng:", err.message);
    res.status(500).json({ message: "Lỗi khi lấy giỏ hàng!", error: err.message });
  }
};

// 🖊️ Cập nhật số lượng
const updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const item = await Cart.findByPk(id);
    if (!item) return res.status(404).json({ message: "Không tìm thấy mục trong giỏ!" });

    item.quantity = quantity;
    await item.save();

    res.status(200).json({ message: "Cập nhật thành công!", cartItem: item });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật giỏ hàng!", error: err.message });
  }
};

// ❌ Xoá mục khỏi giỏ
const deleteCartItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Cart.findByPk(id);
    if (!item) return res.status(404).json({ message: "Không tìm thấy mục trong giỏ!" });

    await item.destroy();
    res.status(200).json({ message: "Đã xoá khỏi giỏ hàng!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá giỏ hàng!", error: err.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem,
};
