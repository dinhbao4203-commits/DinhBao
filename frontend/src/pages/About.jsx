import { motion } from "framer-motion";

export default function About() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <section className="max-w-5xl mx-auto px-4 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center text-green-800 mb-8"
        >
          Giới thiệu về AnimeShop
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg leading-relaxed text-center text-gray-700 max-w-3xl mx-auto"
        >
          <strong>AnimeShop</strong> là nơi dành riêng cho những người yêu thích mô hình anime tại Việt Nam.
          Với sứ mệnh mang đến trải nghiệm mua sắm tuyệt vời, chúng tôi cung cấp các sản phẩm chất lượng,
          chính hãng với mức giá hợp lý. Từ mô hình Shounen mạnh mẽ đến những figure Chibi dễ thương,
          AnimeShop luôn có điều bất ngờ dành cho bạn.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div className="bg-green-50 p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-green-900 mb-2">Sản phẩm đa dạng</h3>
            <p className="text-gray-600">Từ Gundam, One Piece, Naruto đến Demon Slayer – luôn cập nhật liên tục.</p>
          </div>

          <div className="bg-green-50 p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-green-900 mb-2">Dịch vụ tận tâm</h3>
            <p className="text-gray-600">Hỗ trợ khách hàng 24/7, giao hàng nhanh chóng và đóng gói cẩn thận.</p>
          </div>

          <div className="bg-green-50 p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-green-900 mb-2">Giá cả hợp lý</h3>
            <p className="text-gray-600">Chúng tôi cam kết mức giá tốt nhất – thường xuyên có khuyến mãi hấp dẫn.</p>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
