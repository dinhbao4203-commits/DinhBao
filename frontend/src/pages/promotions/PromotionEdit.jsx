import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../axiosInstance";

const PromotionEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount: "",
    startDate: "",
    endDate: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu cũ
  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const res = await API.get(`/promotions/${id}`);
        const promo = res.data;

        setFormData({
          title: promo.title,
          description: promo.description || "",
          discount: promo.discount,
          startDate: promo.startDate.slice(0, 16),
          endDate: promo.endDate.slice(0, 16),
        });
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi tải khuyến mãi:", err);
        setError("Không thể tải dữ liệu khuyến mãi.");
        setLoading(false);
      }
    };

    fetchPromotion();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, discount, startDate, endDate } = formData;

    if (!title || !discount || !startDate || !endDate) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    try {
      await API.put(`/promotions/${id}`, {
        title,
        description,
        discount: parseInt(discount),
        startDate,
        endDate,
      });

      alert("Cập nhật thành công!");
      navigate("/admin/promotions");
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      setError("Cập nhật thất bại.");
    }
  };

  if (loading) {
    return <div className="p-4 text-gray-600">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-green-900">Chỉnh sửa khuyến mãi</h2>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Tên khuyến mãi *</label>
          <input
            type="text"
            name="title"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Mô tả</label>
          <textarea
            name="description"
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-gray-700">Phần trăm giảm giá (%) *</label>
          <input
            type="number"
            name="discount"
            className="w-full border border-gray-300 rounded px-3 py-2"
            min="1"
            max="100"
            value={formData.discount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Ngày bắt đầu *</label>
            <input
              type="datetime-local"
              name="startDate"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Ngày kết thúc *</label>
            <input
              type="datetime-local"
              name="endDate"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-green-700 text-white px-5 py-2 rounded hover:bg-green-800"
          >
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromotionEdit;
