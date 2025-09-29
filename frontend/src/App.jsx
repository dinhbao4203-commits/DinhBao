import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// Layouts
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import ProductCollection from "./pages/collections/ProductCollection";
import ProductDetail from "./pages/collections/ProductDetail";
import Cart from "./pages/cart/Cart";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import MyOrders from "./pages/orders/MyOrders";
import OrderDetail from "./pages/orders/OrderDetail";
import Profile from "./pages/Profile";

// Admin/Staff Dashboard
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import StaffDashboard from "./pages/dashboard/StaffDashboard";

// Product Management (Admin + Staff)
import ProductList from "./pages/products/ProductList";
import ProductCreate from "./pages/products/ProductCreate";
import ProductEdit from "./pages/products/ProductEdit";

// Order Management (Admin + Staff)
import OrderList from "./pages/orders/OrderList";

// Promotion Management (Admin Only)
import PromotionList from "./pages/promotions/PromotionList";
import PromotionCreate from "./pages/promotions/PromotionCreate";
import PromotionEdit from "./pages/promotions/PromotionEdit";
import UserList from "./pages/admin/UserList";
import UserCreate from "./pages/admin/UserCreate";
import UserEdit from "./pages/admin/UserEdit";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* 🔓 Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/collections" element={<ProductCollection />} />
          <Route path="/about" element={<About />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders/my" element={<MyOrders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* 🔐 Admin Routes Only */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="promotions" element={<PromotionList />} />
            <Route path="promotions/create" element={<PromotionCreate />} />
            <Route path="promotions/edit/:id" element={<PromotionEdit />} />
            <Route path="users" element={<UserList />} />
<Route path="users/create" element={<UserCreate />} />
<Route path="users/edit/:id" element={<UserEdit />} />
          </Route>
        </Route>

        {/* 🔐 Shared Admin + Staff Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin", "staff"]} />}>
          <Route path="/staff" element={<AdminLayout />}>
            <Route path="dashboard" element={<StaffDashboard />} />
          </Route>

          {/* 📦 Quản lý sản phẩm */}
          <Route path="/products" element={<AdminLayout />}>
            <Route index element={<ProductList />} />
            <Route path="create" element={<ProductCreate />} />
            <Route path="edit/:id" element={<ProductEdit />} />
          </Route>

          {/* 🛒 Quản lý đơn hàng */}
          <Route path="/orders" element={<AdminLayout />}>
            <Route index element={<OrderList />} />
          </Route>
        </Route>

        {/* ❌ Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
