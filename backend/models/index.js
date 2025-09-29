const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/db.config");

// 1) Khởi tạo Sequelize (thêm port)
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT, // ✅ thêm port từ env
  dialect: dbConfig.dialect || "mysql",
  logging: false,
  pool: dbConfig.pool || { max: 5, min: 0, acquire: 30000, idle: 10000 },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 2) Khởi tạo models
db.user         = require("./user.model")(sequelize, DataTypes);
db.product      = require("./product.model")(sequelize, DataTypes);
db.post         = require("./post.model")(sequelize, DataTypes);
db.promotion    = require("./promotion.model")(sequelize, DataTypes);
db.cart         = require("./cart.model")(sequelize, DataTypes);
db.order        = require("./order.model")(sequelize, DataTypes);
db.orderItem    = require("./orderItem.model")(sequelize, DataTypes);
db.productImage = require("./productImage.model")(sequelize, DataTypes);
db.userAddress  = require("./userAddress.model")(sequelize, DataTypes);


// 3) Khai báo quan hệ

// 👤 User ⇄ UserAddress
db.user.hasMany(db.userAddress, {
  foreignKey: "userId",
  as: "addresses",
  onDelete: "CASCADE",
});
db.userAddress.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
});

// 🛒 Product ⇄ Cart
db.product.hasMany(db.cart, {
  foreignKey: "productId",
  as: "cartItems",
  onDelete: "CASCADE",
});
db.cart.belongsTo(db.product, {
  foreignKey: "productId",
  as: "Product",
  onDelete: "CASCADE",
});

// 👤 User ⇄ Cart
db.user.hasMany(db.cart, {
  foreignKey: "userId",
  as: "cartItems",
  onDelete: "CASCADE",
});
db.cart.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
});

// 🎁 Promotion ⇄ Product
db.promotion.hasMany(db.product, {
  foreignKey: "promotionId",
  as: "products",
  onDelete: "SET NULL",
});
db.product.belongsTo(db.promotion, {
  foreignKey: "promotionId",
  as: "promotion",
  onDelete: "SET NULL",
});

// 🧾 User ⇄ Order
db.user.hasMany(db.order, {
  foreignKey: "userId",
  as: "orders",
  onDelete: "CASCADE",
});
db.order.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
});

// 🧾 Order ⇄ OrderItem
db.order.hasMany(db.orderItem, {
  foreignKey: "orderId",
  as: "items",
  onDelete: "CASCADE",
});
db.orderItem.belongsTo(db.order, {
  foreignKey: "orderId",
  as: "order",
  onDelete: "CASCADE",
});

// 📦 Product ⇄ OrderItem
db.product.hasMany(db.orderItem, {
  foreignKey: "productId",
  as: "orderItems",
  onDelete: "CASCADE",
});
db.orderItem.belongsTo(db.product, {
  foreignKey: "productId",
  as: "product",
  onDelete: "CASCADE",
});

// 📷 Product ⇄ ProductImage
db.product.hasMany(db.productImage, {
  foreignKey: "productId",
  as: "images",
  onDelete: "CASCADE",
});
db.productImage.belongsTo(db.product, {
  foreignKey: "productId",
  as: "product",
  onDelete: "CASCADE",
});

module.exports = db;
