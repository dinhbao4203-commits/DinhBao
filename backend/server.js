const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./models");

const app = express();
const PORT = process.env.PORT || 5000;

// 🌐 Middleware CORS (tự nhận origin khi demo, vẫn whitelist production)
const allowedOrigins = [
  "http://localhost:5173",
  "https://anime-store-frontend-ooc0jsgza-vu-minh-nguyens-projects.vercel.app",
];

app.use(cors({
  origin: true, // tự động phản hồi đúng origin của request
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // hiển thị ảnh local

// 🔌 Kết nối Sequelize và sync model
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("✔️ DB đã kết nối và đồng bộ model.");
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối DB:", err.message);
  });

// 📦 Import các routes
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const productImageRoutes = require("./routes/productImage.routes");
const postRoutes = require("./routes/post.routes");
const promotionRoutes = require("./routes/promotion.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const categoryRoutes = require("./routes/category.routes");
const userAddressRoutes = require("./routes/userAddress.routes");
const userRoutes = require("./routes/user.routes");


// 🚏 Gắn route prefix
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/product-images", productImageRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/userAddress", userAddressRoutes);
app.use("/api/users", userRoutes);


// ▶️ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
