import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaShoppingCart, FaUsers, FaChartLine } from "react-icons/fa";

const mockData = [
  { name: "01/08", revenue: 500000 },
  { name: "02/08", revenue: 750000 },
  { name: "03/08", revenue: 620000 },
  { name: "04/08", revenue: 980000 },
  { name: "05/08", revenue: 450000 },
];

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (user === null) return;

    if (!user) {
      alert("Vui lòng đăng nhập để tiếp tục.");
      navigate("/login");
    }

    if (user && user.role !== "admin") {
      alert("Bạn không có quyền truy cập trang này.");
      navigate("/staff/dashboard");
    }

    setCheckingAuth(false);
  }, [user, navigate]);

  if (checkingAuth || user?.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-gray-900 flex flex-col p-6">
      <h1 className="text-3xl font-bold mb-6">
        <span role="img" aria-label="gear">⚙️</span> Admin Dashboard
      </h1>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Quản lý đơn hàng"
          icon={<FaShoppingCart size={36} />}
          color="from-[#38b000] to-[#008000]"
          link="/orders" // 🔹 Trỏ tới route OrderList
        />
        <DashboardCard
          title="Quản lý tài khoản"
          icon={<FaUsers size={36} />}
          color="from-[#f77f00] to-[#d62828]"
          link="/admin/users"
        />
        <DashboardCard
          title="Quản lý doanh thu"
          icon={<FaChartLine size={36} />}
          color="from-[#7209B7] to-[#3A0CA3]"
          link="/admin/revenue"
        />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Doanh thu trong 5 ngày qua</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${value.toLocaleString()} VND`} />
            <Bar dataKey="revenue" fill="#6A994E" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, icon, color, link }) => (
  <Link
    to={link}
    className={`bg-gradient-to-br ${color} text-white p-6 rounded-2xl shadow hover:scale-105 transition-all`}
  >
    <div className="flex flex-col items-center gap-4">
      {icon}
      <h3 className="text-lg font-medium text-center">{title}</h3>
      <span className="underline text-sm">Truy cập</span>
    </div>
  </Link>
);

export default AdminDashboard;
