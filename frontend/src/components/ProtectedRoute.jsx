import React, { useContext, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isLoading } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    if (user && !allowedRoles.includes(user.role)) {
      alert("Bạn không có quyền truy cập trang này.");
    }
  }, [user, allowedRoles]);

  if (isLoading) {
    return <div className="text-center p-10">Đang tải xác thực...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "staff") return <Navigate to="/staff/dashboard" replace />;
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
