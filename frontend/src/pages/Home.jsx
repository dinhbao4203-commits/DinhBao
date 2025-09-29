import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdNewReleases } from "react-icons/md";
import { FaExclamationTriangle } from "react-icons/fa";
import API, { BASE_IMAGE_URL } from "../axiosInstance";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

// Thêm import context để đồng bộ dữ liệu search với Header
import { useSearch } from "../context/SearchContext";

const slideVariant = (direction) => ({
  hidden: { opacity: 0, x: direction === "left" ? -50 : 50 },
  visible: { opacity: 1, x: 0 },
});

const Home = () => {
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const flashSaleRef = useRef(null);
  const newProductsRef = useRef(null);
  const lowStockRef = useRef(null);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Context search dùng chung với Header
  const { setAllProducts } = useSearch();

  const endTime = new Date("2025-08-05T23:59:59");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: allProducts = [] } = await API.get("/products");

        // Lưu vào context để Header search realtime
        setAllProducts(allProducts);

        const discounted = allProducts
          .filter((p) => p.promotion && p.promotion.discount > 0)
          .sort((a, b) => b.promotion.discount - a.promotion.discount)
          .slice(0, 8);
        setDiscountedProducts(discounted);

        const newest = [...allProducts]
          .sort(
            (a, b) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
          )
          .slice(0, 10);
        setNewProducts(newest);

        let low = allProducts
          .filter((p) => (p.quantity ?? 0) < 5)
          .sort(
            (a, b) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
          )
          .slice(0, 10);

        if (low.length < 10) {
          const excludeIds = new Set(low.map((p) => p.id));
          const fillers = allProducts
            .filter((p) => !excludeIds.has(p.id))
            .sort(
              (a, b) =>
                new Date(a.createdAt || 0).getTime() -
                new Date(b.createdAt || 0).getTime()
            )
            .slice(0, 10 - low.length);
          low = [...low, ...fillers];
        }
        setLowStock(low);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      }
    };
    fetchData();
  }, [setAllProducts]);

  useEffect(() => {
    const countdown = setInterval(() => {
      const now = new Date();
      const diff = endTime - now;

      if (diff <= 0) {
        clearInterval(countdown);
        setTimeLeft({});
      } else {
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const scrollSection = (ref, direction) => {
    const scrollAmount = 320;
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const formatTime = (val) => (val < 10 ? `0${val}` : val);

  const handleAddToCart = async (productId) => {
    if (!user) {
      localStorage.setItem("postLoginRedirect", window.location.pathname);
      return navigate("/login");
    }
    await addToCart(productId);
  };

  const handleBuyNow = async (productId) => {
    if (!user) {
      localStorage.setItem("postLoginRedirect", window.location.pathname);
      return navigate("/login");
    }
    await addToCart(productId);
    navigate("/cart");
  };

  return (
    <div className="bg-white text-gray-800">
      {/* HERO */}
      <section
        className="relative bg-cover bg-center min-h-screen w-full overflow-hidden"
        style={{ backgroundImage: "url('/banner.png')" }}
      >
        <motion.h1
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="absolute top-1/3 w-full text-center text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg"
        >
          Khám phá thế giới mô hình Anime
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          viewport={{ once: true }}
          className="absolute top-[45%] w-full text-center text-lg md:text-xl text-white"
        >
          Giảm giá cực sốc – Giao hàng toàn quốc ✨
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          viewport={{ once: true }}
          className="absolute top-[55%] w-full text-center"
        >
          <Link
            to="/products"
            className="bg-green-600 px-8 py-3 text-white font-bold text-lg rounded-full hover:bg-green-700 transition shadow-lg"
          >
            Mua ngay
          </Link>
        </motion.div>
      </section>

      {/* FLASH SALE */}
      <section className="relative bg-green-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
            className="flex items-center justify-between mb-6"
          >
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <span>🔥 FLASH SALE</span>
              <span className="text-yellow-300 font-mono text-2xl">
                {timeLeft.hours !== undefined
                  ? `${formatTime(timeLeft.hours)}:${formatTime(
                      timeLeft.minutes
                    )}:${formatTime(timeLeft.seconds)}`
                  : "00:00:00"}
              </span>
            </h2>
          </motion.div>

          <div className="relative">
            <button
              onClick={() => scrollSection(flashSaleRef, "left")}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-full shadow-md"
            >
              <FiChevronLeft size={24} />
            </button>

            <div
              ref={flashSaleRef}
              className="overflow-x-auto scroll-smooth px-6 pb-4 no-scrollbar"
            >
              <div className="flex gap-4 w-max">
                {discountedProducts.map((p, index) => (
                  <motion.div
                    key={p.id}
                    variants={slideVariant(index % 2 === 0 ? "left" : "right")}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="w-[220px] h-[320px] bg-white rounded-xl shadow-md text-black p-4 flex-shrink-0 flex flex-col justify-between hover:shadow-2xl"
                  >
                    <div className="w-full aspect-[3/4] overflow-hidden rounded-md mb-3 flex items-center justify-center bg-white">
                      <img
                        src={`${BASE_IMAGE_URL}${p.image}`}
                        alt={p.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <h3 className="font-semibold text-sm" title={p.name}>
                      {p.name}
                    </h3>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-500 line-through">
                          {p.price.toLocaleString()}đ
                        </span>
                        <span className="text-green-600 font-bold text-lg">
                          {p.finalPrice.toLocaleString()}đ
                        </span>
                      </div>
                      <button
                        onClick={() => handleBuyNow(p.id)}
                        className="flex items-center justify-center bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-full text-sm w-full"
                      >
                        Mua ngay
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <button
              onClick={() => scrollSection(flashSaleRef, "right")}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-full shadow-md"
            >
              <FiChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* NEW PRODUCTS */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-green-900 mb-6 flex items-center gap-2">
          <MdNewReleases className="text-green-700" size={32} />
          Sản phẩm mới
        </h2>
        <div className="relative">
          <button
            onClick={() => scrollSection(newProductsRef, "left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-green-600 hover:bg-green-700 text-white rounded-full p-2 shadow-md"
          >
            <FiChevronLeft size={20} />
          </button>
          <div
            ref={newProductsRef}
            className="overflow-x-auto no-scrollbar scroll-smooth"
          >
            <div className="flex gap-6 w-max">
              {newProducts.map((p, index) => (
                <motion.div
                  key={p.id}
                  variants={slideVariant(index % 2 === 0 ? "left" : "right")}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-2xl transition flex flex-col justify-between w-[220px]"
                  whileHover={{ scale: 1.04 }}
                >
                  <div className="w-full aspect-[3/4] flex items-center justify-center bg-white p-3">
                    <img
                      src={`${BASE_IMAGE_URL}${p.image}`}
                      alt={p.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <h3 className="font-semibold text-sm" title={p.name}>
                      {p.name}
                    </h3>
                    <p className="text-green-700 font-bold text-lg">
                      {(p.finalPrice ?? p.price).toLocaleString()}đ
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Link
                        to={`/products/${p.id}`}
                        className="flex-1 flex items-center justify-center bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-full text-center text-sm font-semibold"
                      >
                        Xem chi tiết
                      </Link>
                      <button
                        onClick={() => handleAddToCart(p.id)}
                        className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                        title="Thêm vào giỏ hàng"
                      >
                        🛒
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <button
            onClick={() => scrollSection(newProductsRef, "right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-green-600 hover:bg-green-700 text-white rounded-full p-2 shadow-md"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* LOW STOCK */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-green-900 mb-6 flex items-center gap-2">
          <FaExclamationTriangle className="text-yellow-500" size={28} />
          Sản phẩm sắp hết hàng
        </h2>
        <div className="relative">
          <button
            onClick={() => scrollSection(lowStockRef, "left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-green-600 hover:bg-green-700 text-white rounded-full p-2 shadow-md"
          >
            <FiChevronLeft size={20} />
          </button>
          <div
            ref={lowStockRef}
            className="overflow-x-auto no-scrollbar scroll-smooth"
          >
            <div className="flex gap-6 w-max">
              {lowStock.map((p, index) => (
                <motion.div
                  key={p.id}
                  variants={slideVariant(index % 2 === 0 ? "left" : "right")}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-2xl transition flex flex-col justify-between w-[220px]"
                  whileHover={{ scale: 1.04 }}
                >
                  <div className="w-full aspect-[3/4] flex items-center justify-center bg-white p-3">
                    <img
                      src={`${BASE_IMAGE_URL}${p.image}`}
                      alt={p.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <h3 className="font-semibold text-sm" title={p.name}>
                      {p.name}
                    </h3>
                    <p className="text-green-700 font-bold text-lg">
                      {(p.finalPrice ?? p.price).toLocaleString()}đ
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Link
                        to={`/products/${p.id}`}
                        className="flex-1 flex items-center justify-center bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-full text-center text-sm font-semibold"
                      >
                        Xem chi tiết
                      </Link>
                      <button
                        onClick={() => handleAddToCart(p.id)}
                        className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                        title="Thêm vào giỏ hàng"
                      >
                        🛒
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <button
            onClick={() => scrollSection(lowStockRef, "right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-green-600 hover:bg-green-700 text-white rounded-full p-2 shadow-md"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
        <div className="mt-16 text-center">
          <Link
            to="/collections"
            className="inline-block bg-green-700 hover:bg-green-800 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
