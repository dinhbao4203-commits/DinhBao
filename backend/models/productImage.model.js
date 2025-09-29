module.exports = (sequelize, DataTypes) => {
  const ProductImage = sequelize.define("ProductImage", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    }
  }, {
    tableName: "product_images",
    timestamps: true
  });

  return ProductImage;
};
