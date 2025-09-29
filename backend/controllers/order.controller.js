// controllers/order.controller.js
const db = require("../models");
const { sequelize } = db;
const Order = db.order;
const OrderItem = db.orderItem;
const Cart = db.cart;
const Product = db.product;
const Promotion = db.promotion;
const User = db.user;

// ➕ Tạo đơn hàng từ giỏ hàng (KHÔNG trừ kho ngay)
const createOrder = async (req, res) => {
  const userId = req.user.id;
  const { name, email, phone, address, paymentMethod } = req.body;

  if (!paymentMethod || !phone || !address) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin đặt hàng!" });
  }

  const t = await sequelize.transaction();

  try {
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: "Product",
          include: [
            {
              model: Promotion,
              as: "promotion",
              attributes: ["discount", "startDate", "endDate"]
            }
          ]
        }
      ],
      transaction: t
    });

    if (cartItems.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: "Giỏ hàng trống!" });
    }

    const now = new Date();
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of cartItems) {
      const product = item.Product;
      if (!product) continue;

      const basePrice = parseFloat(product.price);
      let finalPrice = basePrice;

      const promo = product.promotion;
      if (
        promo &&
        new Date(promo.startDate) <= now &&
        new Date(promo.endDate) >= now
      ) {
        finalPrice = basePrice - basePrice * (promo.discount / 100);
      }

      const itemTotal = finalPrice * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: parseFloat(finalPrice.toFixed(2))
      });
    }

    const newOrder = await Order.create({
      userId,
      name,
      email,
      phone,
      address,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      paymentMethod,
      status: "pending"
    }, { transaction: t });

    for (const item of orderItemsData) {
      await OrderItem.create({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }, { transaction: t });
    }

    await Cart.destroy({ where: { userId }, transaction: t });

    await t.commit();

    res.status(201).json({
      message: "Tạo đơn hàng thành công!",
      orderId: newOrder.id,
      totalAmount: newOrder.totalAmount
    });
  } catch (err) {
    await t.rollback();
    console.error("❌ Lỗi tạo đơn hàng:", err);
    res.status(500).json({ message: "Lỗi khi tạo đơn hàng!", error: err.message });
  }
};

// 📋 Admin/Staff: Lấy tất cả đơn hàng
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }]
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách đơn hàng!", error: err.message });
  }
};

// 👤 Người dùng: Lấy đơn hàng của mình
const getMyOrders = async (req, res) => {
  const userId = req.user.id;
  try {
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }]
        }
      ],
      order: [["createdAt", "DESC"]]
    });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy đơn hàng của bạn!", error: err.message });
  }
};

// 🔍 Xem chi tiết đơn hàng (check quyền)
const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }]
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
    }

    if (req.onlyOwnOrder && order.userId !== req.user.id) {
      return res.status(403).json({ message: "Bạn không có quyền xem đơn hàng này!" });
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy chi tiết đơn hàng!", error: err.message });
  }
};

// 🔄 Cập nhật trạng thái đơn hàng (trừ kho + cộng sold + revenue khi confirmed)
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatus = ["pending", "confirmed", "shipped", "cancelled"];
  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ!" });
  }

  const t = await sequelize.transaction();

  try {
    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem, as: "items" }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!order) {
      await t.rollback();
      return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
    }

    // Nếu chuyển sang confirmed thì trừ kho + cập nhật sold + revenue
    if (status === "confirmed" && order.status !== "confirmed") {
      for (const item of order.items) {
        const product = await Product.findByPk(item.productId, { transaction: t, lock: t.LOCK.UPDATE });
        if (!product) continue;

        if (product.quantity < item.quantity) {
          await t.rollback();
          return res.status(400).json({ message: `Sản phẩm "${product.name}" không đủ hàng trong kho!` });
        }

        product.quantity -= item.quantity;
        product.sold = (product.sold || 0) + item.quantity;
        product.revenue = (product.revenue || 0) + (item.price * item.quantity);
        await product.save({ transaction: t });
      }
    }

    order.status = status;
    await order.save({ transaction: t });

    await t.commit();

    res.status(200).json({ message: "Cập nhật trạng thái thành công!", order });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái!", error: err.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus
};
