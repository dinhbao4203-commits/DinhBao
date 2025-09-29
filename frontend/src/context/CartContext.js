import { createContext, useContext, useEffect, useState } from "react";
import API from "../axiosInstance";
import { AuthContext } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const { user, isLoading } = useContext(AuthContext);

  const computeCount = (items) =>
    items.reduce((sum, i) => sum + (i.quantity || 0), 0);

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      setCartCount(0);
      return;
    }
    try {
      const res = await API.get("/cart", { params: { t: Date.now() } }); // thêm timestamp để tránh cache
      const items = Array.isArray(res.data?.items) ? res.data.items : [];
      setCartItems(items);
      setCartCount(computeCount(items));
    } catch (err) {
      console.error("Lỗi khi tải giỏ hàng:", err);
      setCartItems([]);
      setCartCount(0);
    }
  };

  useEffect(() => {
    if (!isLoading) fetchCart();
  }, [user, isLoading]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) return;
    try {
      await API.post("/cart", { productId, quantity });
      await fetchCart();
    } catch (err) {
      console.error("❌ Lỗi khi thêm vào giỏ hàng:", err);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!user) return;

    // ✅ Cập nhật UI ngay lập tức (Optimistic Update)
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    setCartCount((prev) => prev - 1);

    try {
      await API.delete(`/cart/${itemId}`);
      await fetchCart(); // đồng bộ lại từ server
    } catch (err) {
      console.error("❌ Lỗi khi xoá khỏi giỏ hàng:", err);
      await fetchCart(); // nếu lỗi, load lại để tránh sai dữ liệu
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        setCartCount,
        setCartItems,
        addToCart,
        removeFromCart,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart phải nằm trong CartProvider");
  return context;
};
