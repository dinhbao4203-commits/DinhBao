module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    sold: { // 🆕 Số lượng đã bán
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    revenue: { // 🆕 Doanh thu từ sản phẩm
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    promotionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "promotions",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL"
    }
  }, {
    tableName: "products",
    timestamps: true
  });

  return Product;
};
