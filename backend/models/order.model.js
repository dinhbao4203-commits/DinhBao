// models/order.model.js
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    // 📌 Thông tin người nhận hàng
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    // 💰 Tổng tiền đơn hàng
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },

    // 💳 Phương thức thanh toán
    paymentMethod: {
      type: DataTypes.ENUM("cod", "bank_transfer", "credit_card"),
      allowNull: false
    },

    // 📦 Trạng thái đơn hàng
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "shipped", "cancelled"),
      defaultValue: "pending"
    }
  }, {
    tableName: "orders",
    timestamps: true
  });

  return Order;
};
