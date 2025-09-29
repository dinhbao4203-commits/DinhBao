import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-green-900 text-white pt-10 pb-6 px-6 mt-12 w-full"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Cột 1: Logo */}
        <div>
          <h2 className="text-2xl font-bold text-yellow-300 mb-3">AnimeShop</h2>
          <p className="text-sm text-gray-300">
            Nơi hội tụ những mô hình anime chất lượng – dành cho mọi fan chân chính. Mua sắm dễ dàng, giao hàng toàn quốc.
          </p>
        </div>

        {/* Cột 2: Điều hướng */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-yellow-200">Điều hướng</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-yellow-300">Trang chủ</Link></li>
            <li><Link to="/products" className="hover:text-yellow-300">Tất cả sản phẩm</Link></li>
            <li><Link to="/collections" className="hover:text-yellow-300">Thể loại</Link></li>
            <li><Link to="/about" className="hover:text-yellow-300">Về chúng tôi</Link></li>
          </ul>
        </div>

        {/* Cột 3: Hỗ trợ */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-yellow-200">Hỗ trợ</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="mailto:hotro@animeshop.vn" className="hover:text-yellow-300">hotro@animeshop.vn</a></li>
            <li><a href="tel:0123456789" className="hover:text-yellow-300">0123 456 789</a></li>
            <li>Giờ làm: 8:00 – 22:00</li>
          </ul>
        </div>

        {/* Cột 4: MXH */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-yellow-200">Kết nối</h3>
          <div className="flex gap-4 text-2xl">
            <a href="#" className="hover:text-yellow-300">🌐</a>
            <a href="#" className="hover:text-yellow-300">📘</a>
            <a href="#" className="hover:text-yellow-300">📸</a>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-white/20 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} AnimeShop. All rights reserved.
      </div>
    </motion.footer>
  );
}
