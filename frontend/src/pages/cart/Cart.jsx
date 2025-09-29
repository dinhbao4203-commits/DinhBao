import React, { useEffect, useState } from "react";
import API, { BASE_IMAGE_URL } from "../../axiosInstance";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await API.get("/cart");
        const items = Array.isArray(res.data.items) ? res.data.items : [];
        setCartItems(items);
        calculateTotal(items);
      } catch (err) {
        console.error("❌ Lỗi khi lấy giỏ hàng:", err);
      }
    };

    fetchCart();
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      const product = item.Product;
      const finalPrice = product?.finalPrice || 0;
      return sum + finalPrice * item.quantity;
    }, 0);
    setTotalPrice(total);
  };

  const handleQuantityChange = async (id, newQty) => {
    if (newQty < 1) return;

    try {
      await API.put(`/cart/${id}`, { quantity: newQty });
      const updated = cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      );
      setCartItems(updated);
      calculateTotal(updated);
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật số lượng:", err);
    }
  };

  const handleRemove = async (id) => {
    const confirmDelete = window.confirm("🗑️ Bạn có chắc chắn muốn xoá sản phẩm này khỏi giỏ hàng?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/cart/${id}`);
      const updated = cartItems.filter((item) => item.id !== id);
      setCartItems(updated);
      calculateTotal(updated);
      toast.success("✅ Đã xoá sản phẩm khỏi giỏ hàng!");
    } catch (err) {
      console.error("❌ Lỗi khi xoá sản phẩm:", err);
      toast.error("❌ Không thể xoá sản phẩm!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 min-h-screen">
      <ToastContainer position="top-right" autoClose={2500} />
      <h1 className="text-3xl font-bold mb-6 text-green-900">🛒 Giỏ hàng của bạn</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Không có sản phẩm nào trong giỏ hàng.</p>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map((item) => {
              const product = item.Product;
              const imageSrc = product?.images?.[0]?.url || product?.image || "/fallback.jpg";

              return (
                <motion.div
                  key={item.id}
                  className="flex items-center gap-4 border rounded-lg p-4 shadow-sm bg-white"
                  whileHover={{ scale: 1.01 }}
                >
                  <img
                    src={`${BASE_IMAGE_URL}${imageSrc}`}
                    alt={product?.name}
                    className="w-24 h-24 object-cover rounded"
                  />

                  <div className="flex-1">
                    <h2 className="font-semibold text-lg text-green-900">
                      {product?.name || "Tên sản phẩm"}
                    </h2>

                    <div className="flex items-center gap-2 mt-1">
                      {product?.promotion?.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.price.toLocaleString()}đ
                        </span>
                      )}
                      <span className="text-green-700 font-bold text-xl">
                        {product?.finalPrice?.toLocaleString()}đ
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <label className="text-sm">Số lượng:</label>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.id, parseInt(e.target.value))
                        }
                        className="w-16 px-2 py-1 border rounded text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1 rounded text-sm font-medium transition duration-200"
                    >
                      ❌ Xoá
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-10 text-right">
            <p className="text-xl font-bold text-green-800">
              Tổng cộng: {totalPrice.toLocaleString()}đ
            </p>
            <button
              className="mt-4 bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-full font-semibold shadow"
              onClick={() => navigate("/checkout")}
            >
              Tiến hành đặt hàng
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
