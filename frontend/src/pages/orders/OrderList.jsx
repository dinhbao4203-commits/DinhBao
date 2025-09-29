import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const OrderList = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success("Cập nhật trạng thái thành công!");
      fetchOrders(); // Refresh danh sách
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  if (loading) {
    return <p>Đang tải danh sách đơn hàng...</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">📦 Quản lý đơn hàng</h1>

      {orders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Khách hàng</th>
                <th className="border p-2">Tổng tiền</th>
                <th className="border p-2">Thanh toán</th>
                <th className="border p-2">Trạng thái</th>
                <th className="border p-2">Ngày tạo</th>
                <th className="border p-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="text-center">
                  <td className="border p-2">{order.id}</td>
                  <td className="border p-2">{order.user?.name || "N/A"}</td>
                  <td className="border p-2">
                    {Number(order.totalAmount).toLocaleString()} ₫
                  </td>
                  <td className="border p-2">{order.paymentMethod}</td>
                  <td className="border p-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="pending">Chờ xử lý</option>
                      <option value="confirmed">Đã xác nhận</option>
                      <option value="shipped">Đã giao</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </td>
                  <td className="border p-2">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="border p-2">
                    <Link
                      to={`/orders/${order.id}`}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Xem
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderList;
