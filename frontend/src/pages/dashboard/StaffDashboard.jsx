import React from "react";
import { FaBoxOpen, FaPenNib } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "24/7", revenue: 320 },
  { name: "25/7", revenue: 500 },
  { name: "26/7", revenue: 380 },
  { name: "27/7", revenue: 460 },
  { name: "28/7", revenue: 590 },
];

const StaffDashboard = () => {
  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white px-4 py-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        👨‍💼 Staff Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Product Card */}
        <div className="rounded-2xl p-6 bg-gradient-to-r from-[#4d6331] to-[#7a4f38] shadow-md hover:scale-105 transition duration-300">
          <div className="flex flex-col items-center">
            <FaBoxOpen className="text-5xl mb-2" />
            <h2 className="text-xl font-semibold">Quản lý sản phẩm</h2>
            <Link
              to="/products"
              className="mt-2 text-sm underline hover:text-gray-200"
            >
              Truy cập
            </Link>
          </div>
        </div>

        {/* Post Card */}
        <div className="rounded-2xl p-6 bg-gradient-to-r from-[#7a4f38] to-[#4d6331] shadow-md hover:scale-105 transition duration-300">
          <div className="flex flex-col items-center">
            <FaPenNib className="text-5xl mb-2" />
            <h2 className="text-xl font-semibold">Quản lý bài viết</h2>
            <Link
              to="/admin/posts"
              className="mt-2 text-sm underline hover:text-gray-200"
            >
              Truy cập
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 text-black shadow-md">
        <h2 className="text-lg font-bold mb-2 text-center">Thống kê doanh thu</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#4d6331" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StaffDashboard;
