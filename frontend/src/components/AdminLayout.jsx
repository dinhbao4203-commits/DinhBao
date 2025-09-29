import { Outlet, Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaBox, FaTags, FaTachometerAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Kiểm tra quyền hạn
  useEffect(() => {
    if (!user) {
      toast.error("Bạn cần đăng nhập.");
      navigate("/login");
    } else if (user.role !== "admin" && window.location.pathname.startsWith("/admin")) {
      toast.error("Bạn không đủ quyền để truy cập trang Admin.");
      navigate("/staff/dashboard");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen w-screen bg-[#F3F4F6] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F0F0F] text-white flex flex-col justify-between fixed left-0 top-0 h-screen z-20">
        <div>
          <Link
            to="/"
            className="text-2xl font-bold p-4 border-b border-gray-700 block hover:text-green-300 transition"
          >
            AnimeShop
          </Link>
          <nav className="flex flex-col gap-2 px-4 pt-4">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 py-2 hover:text-green-300"
            >
              <FaTachometerAlt /> Dashboard
            </Link>
            <Link
              to="/products"
              className="flex items-center gap-2 py-2 hover:text-green-300"
            >
              <FaBox /> Sản phẩm
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin/promotions"
                className="flex items-center gap-2 py-2 hover:text-green-300"
              >
                <FaTags /> Khuyến mãi
              </Link>
            )}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="p-4 hover:text-red-400 text-left"
        >
          Đăng xuất
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 min-h-screen bg-[#F3F4F6] p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
