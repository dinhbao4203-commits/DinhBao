import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API, { BASE_IMAGE_URL } from "../../axiosInstance";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ProductCollection = () => {
  const [products, setProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState(""); 
  const query = useQuery();
  const category = query.get("category");
  const search = (query.get("q") || "").trim().toLowerCase();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        let data = res.data;

        // Lọc theo category nếu có
        if (category) {
          data = data.filter(
            (p) =>
              p.category &&
              p.category.toLowerCase() === category.toLowerCase()
          );
        }

        // Lọc theo từ khóa tìm kiếm nếu có
        if (search) {
          data = data.filter(
            (p) =>
              (p.name || "").toLowerCase().includes(search) ||
              (p.description || "").toLowerCase().includes(search)
          );
        }

        setProducts(data);
        setDisplayProducts(data);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, search]);

  useEffect(() => {
    let sorted = [...products];
    if (sortOrder === "asc") {
      sorted.sort((a, b) => a.finalPrice - b.finalPrice);
    } else if (sortOrder === "desc") {
      sorted.sort((a, b) => b.finalPrice - a.finalPrice);
    }
    setDisplayProducts(sorted);
  }, [sortOrder, products]);

  const handleAddToCart = async (productId) => {
    if (!user) {
      localStorage.setItem(
        "postLoginRedirect",
        window.location.pathname + window.location.search
      );
      return navigate("/login");
    }
    await addToCart(productId);
  };

  const handleBuyNow = async (productId) => {
    if (!user) {
      localStorage.setItem(
        "postLoginRedirect",
        window.location.pathname + window.location.search
      );
      return navigate("/login");
    }
    await addToCart(productId);
    navigate("/cart");
  };

  if (loading)
    return <div className="p-6 text-gray-600">Đang tải sản phẩm...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Tiêu đề + Bộ lọc */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold text-green-900">
          {category
            ? `Thể loại: ${category}`
            : search
            ? `Kết quả tìm kiếm cho: "${search}"`
            : "Tất cả sản phẩm"}
        </h2>
        <div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Sắp xếp</option>
            <option value="asc">Giá: Thấp đến Cao</option>
            <option value="desc">Giá: Cao đến Thấp</option>
          </select>
        </div>
      </div>

      {displayProducts.length === 0 ? (
        <p className="text-gray-500">Không tìm thấy sản phẩm phù hợp.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayProducts.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition flex flex-col justify-between"
            >
              <div className="w-full aspect-[3/4] bg-white p-3 flex items-center justify-center">
                <img
                  src={`${BASE_IMAGE_URL}${p.image}`}
                  alt={p.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-semibold text-sm line-clamp-2 h-[40px]">
                  {p.name}
                </h3>
                <p className="text-green-700 font-bold text-lg">
                  {p.finalPrice.toLocaleString()}đ
                </p>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleBuyNow(p.id)}
                    className="flex-1 bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-full text-base font-semibold text-center transition-all duration-200"
                  >
                    Mua ngay
                  </button>
                  <button
                    onClick={() => handleAddToCart(p.id)}
                    className="flex items-center justify-center w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full text-lg transition-all duration-200"
                    title="Thêm vào giỏ hàng"
                  >
                    🛒
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCollection;
