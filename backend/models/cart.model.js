// models/cart.model.js
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define("Cart", {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    tableName: "carts",
    timestamps: true
  });

  return Cart;
};
