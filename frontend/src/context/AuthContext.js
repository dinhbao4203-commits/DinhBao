import { createContext, useState, useEffect, useContext } from "react";
import API from "../axiosInstance";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  // Load user từ localStorage khi app khởi động
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser?.token) setUser(parsedUser);
          else localStorage.removeItem("user");
        }
      } catch {
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // Khi user thay đổi → load giỏ hàng
  useEffect(() => {
    if (!user?.token) {
      setCartCount(0);
      return;
    }
    API.get("/cart")
      .then((res) => {
        const items = Array.isArray(res.data?.items) ? res.data.items : [];
        const totalItems = items.reduce((sum, it) => sum + (it.quantity || 0), 0);
        setCartCount(totalItems);
      })
      .catch(() => setCartCount(0));
  }, [user]);

  // Đăng nhập
  const login = (userData) => {
    if (!userData?.token) return;
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Cập nhật thông tin hiển thị sau khi user đổi tên/email
  const updateUser = (patch) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  };

  // Đăng xuất
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setCartCount(0);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        updateUser,
        logout,
        cartCount,
        setCartCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
