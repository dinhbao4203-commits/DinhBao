// models/orderItem.model.js
module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define("OrderItem", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    tableName: "order_items",
    timestamps: true
  });

  return OrderItem;
};
