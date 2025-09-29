import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { SearchProvider } from "./context/SearchContext"; // 📌 Import SearchProvider

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <SearchProvider> {/* 📌 Thêm SearchProvider để dùng search realtime */}
          <ToastProvider>
            <App />
          </ToastProvider>
        </SearchProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
