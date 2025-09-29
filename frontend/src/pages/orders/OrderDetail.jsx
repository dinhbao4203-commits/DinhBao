import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API, { BASE_IMAGE_URL } from "../../axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setIsLoading(true);
      const res = await API.get(`/orders/${id}`);
      setOrder(res.data);
    } catch {
      toast.error("❌ Lỗi khi tải chi tiết đơn hàng!");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p className="text-gray-500 p-6">⏳ Đang tải dữ liệu...</p>;
  }

  if (!order) {
    return <p className="text-gray-500 p-6">Không tìm thấy đơn hàng.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <ToastContainer position="top-right" autoClose={2000} />
      <h1 className="text-2xl font-bold text-green-800 mb-6">📦 Chi tiết đơn hàng #{order.id}</h1>

      <div className="bg-white p-6 rounded shadow mb-6">
        <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString("vi-VN")}</p>
        <p>
          <strong>Trạng thái:</strong>{" "}
          <span className={`px-2 py-1 rounded text-sm font-medium ${statusColors[order.status] || ""}`}>
            {order.status}
          </span>
        </p>
        <p><strong>Người đặt:</strong> {order.user?.name} ({order.user?.email})</p>
        <p><strong>Điện thoại:</strong> {order.phone}</p>
        <p><strong>Địa chỉ:</strong> {order.address}</p>
        <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>
        <p className="text-lg font-semibold text-green-700 mt-2">
          Tổng tiền: {order.totalAmount?.toLocaleString()}đ
        </p>
      </div>

      <h2 className="text-xl font-semibold text-green-800 mb-4">🛍️ Sản phẩm</h2>
      <div className="bg-white rounded shadow divide-y">
        {order.items?.map((item) => {
          const product = item.product;
          const imgSrc = product?.images?.[0]?.url || product?.image || "/fallback.jpg";
          return (
            <div key={item.id} className="flex items-center gap-4 p-4">
              <img
                src={`${BASE_IMAGE_URL}${imgSrc}`}
                alt={product?.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{product?.name}</p>
                <p className="text-sm text-gray-600">
                  Số lượng: {item.quantity} × {item.price?.toLocaleString()}đ
                </p>
              </div>
              <div className="text-green-700 font-semibold">
                {(item.quantity * item.price).toLocaleString()}đ
              </div>
            </div>
          );
        })}
      </div>

      <Link
        to="/orders/my"
        className="mt-6 inline-block bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded shadow"
      >
        ⬅ Quay lại danh sách đơn hàng
      </Link>
    </div>
  );
};

export default OrderDetail;
