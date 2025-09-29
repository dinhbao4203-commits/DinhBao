import { useEffect, useState } from "react";
import API from "../../axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setIsLoading(true);
      const res = await API.get("/orders/my");
      setOrders(res.data || []);
    } catch {
      toast.error("❌ Lỗi khi tải lịch sử đơn hàng!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <ToastContainer position="top-right" autoClose={2000} />
      <h1 className="text-2xl font-bold text-green-800 mb-6">📜 Lịch sử đơn hàng</h1>

      {isLoading ? (
        <p className="text-gray-500">⏳ Đang tải...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-green-100">
                <th className="p-3 border">Ngày đặt</th>
                <th className="p-3 border">Trạng thái</th>
                <th className="p-3 border">Tổng tiền</th>
                <th className="p-3 border">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-3 border">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </td>
                  <td className="p-3 border">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${statusColors[order.status] || ""}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 border text-green-700 font-semibold">
                    {order.totalAmount?.toLocaleString()}đ
                  </td>
                  <td className="p-3 border">
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Xem chi tiết
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

export default MyOrders;
