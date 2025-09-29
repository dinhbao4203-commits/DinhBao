import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../../axiosInstance";
import { AuthContext } from "../../context/AuthContext";

const PromotionList = () => {
  const { user } = useContext(AuthContext);
  const [promotions, setPromotions] = useState([]);

  const fetchPromotions = async () => {
    try {
      const res = await API.get("/promotions");
      setPromotions(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách khuyến mãi:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá khuyến mãi này không?")) {
      try {
        await API.delete(`/promotions/${id}`);
        setPromotions((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        console.error("Lỗi khi xoá:", err);
        alert("Xoá thất bại.");
      }
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-900">Danh sách khuyến mãi</h1>
        {user?.role === "admin" && (
          <Link
            to="/admin/promotions/create"
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            + Thêm khuyến mãi
          </Link>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded">
          <thead className="bg-green-200 text-gray-800">
            <tr>
              <th className="py-2 px-4 border-b">Tên khuyến mãi</th>
              <th className="py-2 px-4 border-b">Mô tả</th>
              <th className="py-2 px-4 border-b">% giảm</th>
              <th className="py-2 px-4 border-b">Bắt đầu</th>
              <th className="py-2 px-4 border-b">Kết thúc</th>
              {user?.role === "admin" && <th className="py-2 px-4 border-b">Hành động</th>}
            </tr>
          </thead>
          <tbody>
            {promotions.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Không có khuyến mãi nào.
                </td>
              </tr>
            ) : (
              promotions.map((promo) => (
                <tr key={promo.id} className="hover:bg-green-50">
                  <td className="py-2 px-4 border-b">{promo.title}</td>
                  <td className="py-2 px-4 border-b">{promo.description}</td>
                  <td className="py-2 px-4 border-b text-center">{promo.discount}%</td>
                  <td className="py-2 px-4 border-b">{new Date(promo.startDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">{new Date(promo.endDate).toLocaleDateString()}</td>
                  {user?.role === "admin" && (
                    <td className="py-2 px-4 border-b space-x-2">
                      <Link
                        to={`/admin/promotions/edit/${promo.id}`}
                        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(promo.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Xoá
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromotionList;
