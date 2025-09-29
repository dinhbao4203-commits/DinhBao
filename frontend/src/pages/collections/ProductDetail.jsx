import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, { BASE_IMAGE_URL } from "../../axiosInstance";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext"; // ✅ Thêm

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth(); // ✅ lấy user
  const [product, setProduct] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy chi tiết sản phẩm:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="text-center py-10">Đang tải sản phẩm...</div>;

  const allImages = [
    product.image,
    ...(product.images?.map((img) => img.url) || [])
  ];

  const prevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  // ✅ Thêm vào giỏ hàng (check login)
  const handleAddToCart = async () => {
    if (!user) {
      localStorage.setItem("postLoginRedirect", window.location.pathname);
      return navigate("/login");
    }
    try {
      await addToCart(product.id, 1);
      alert("🛒 Đã thêm vào giỏ hàng!");
    } catch (err) {
      console.error("❌ Thêm giỏ hàng thất bại:", err);
    }
  };

  // ✅ Mua ngay (check login)
  const handleBuyNow = async () => {
    if (!user) {
      localStorage.setItem("postLoginRedirect", window.location.pathname);
      return navigate("/login");
    }
    try {
      await addToCart(product.id, 1);
      navigate("/cart");
    } catch (err) {
      console.error("❌ Mua ngay thất bại:", err);
    }
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Hình ảnh sản phẩm */}
          <div className="relative border rounded-xl p-4 shadow-sm bg-white">
            <img
              src={`${BASE_IMAGE_URL}${allImages[activeIndex]}`}
              alt="main"
              className="w-full h-[400px] object-contain rounded-md"
            />
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-green-700 hover:bg-green-800 text-white p-2 rounded-full shadow-md z-10"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-700 hover:bg-green-800 text-white p-2 rounded-full shadow-md z-10"
            >
              <FiChevronRight size={24} />
            </button>
            <div className="flex gap-2 mt-4 flex-wrap justify-center">
              {allImages.map((img, index) => (
                <img
                  key={index}
                  src={`${BASE_IMAGE_URL}${img}`}
                  alt={`thumb-${index}`}
                  onClick={() => setActiveIndex(index)}
                  className={`w-16 h-16 object-cover rounded-md cursor-pointer border ${
                    activeIndex === index
                      ? "border-green-600 ring-2 ring-green-400"
                      : "border-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-green-900">{product.name}</h1>

            <div>
              {product.promotion?.discount > 0 ? (
                <div>
                  <span className="text-gray-500 line-through text-lg mr-2">
                    {product.price.toLocaleString()}đ
                  </span>
                  <span className="text-green-700 text-2xl font-bold bg-yellow-100 px-2 py-1 rounded">
                    {product.finalPrice.toLocaleString()}đ
                  </span>
                </div>
              ) : (
                <span className="text-green-700 text-2xl font-bold">
                  {product.price.toLocaleString()}đ
                </span>
              )}
            </div>

            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {product.description || "Mô tả sản phẩm đang được cập nhật..."}
            </p>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-2 rounded-full shadow"
              >
                Thêm vào giỏ hàng
              </button>
              <button
                onClick={handleBuyNow}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-full shadow"
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
