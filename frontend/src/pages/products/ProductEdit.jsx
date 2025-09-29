import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { ReactSortable } from "react-sortablejs";

const SERVER_URL = "http://localhost:5000";

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    promotionId: ""
  });

  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        const p = res.data;
        setForm({
          name: p.name,
          description: p.description,
          price: p.price,
          quantity: p.quantity,
          category: p.category,
          promotionId: p.promotionId || ""
        });
        setPreviewImage(`${SERVER_URL}${p.image}`);
        setExistingImages((p.images || []).sort((a, b) => a.order - b.order));
      } catch (err) {
        toast.error("Không tải được dữ liệu sản phẩm");
      }
    };

    fetchData();

    if (user?.role === "admin") {
      API.get("/promotions")
        .then((res) => setPromotions(res.data))
        .catch(() => toast.error("Không tải được khuyến mãi"));
    }
  }, [id, user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveExistingImage = async (imageId) => {
    try {
      await API.delete(`/product-images/${imageId}`);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch {
      toast.error("Không thể xoá ảnh");
    }
  };

  const handleUploadAtSlot = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      await API.post(`/products/${id}/images`, formData);
      const updated = await API.get(`/products/${id}`);
      setExistingImages(updated.data.images.sort((a, b) => a.order - b.order));
    } catch {
      toast.error("Lỗi khi thêm ảnh");
    }
  };

  const handleReorderImages = async (newOrder) => {
    setExistingImages(newOrder);
    try {
      await API.put(`/products/${id}/images/reorder`, {
        order: newOrder.map((img) => img.id)
      });
    } catch {
      toast.error("Không thể cập nhật thứ tự ảnh");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (image) formData.append("image", image);

      await API.put(`/products/${id}`, formData);
      toast.success("Đã cập nhật sản phẩm");
      navigate("/products");
    } catch (err) {
      toast.error("Lỗi khi cập nhật sản phẩm");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Chỉnh sửa sản phẩm</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Tên sản phẩm" required />

        <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Mô tả" rows={4} />

        <div className="grid grid-cols-2 gap-4">
          <input type="number" name="price" value={form.price} onChange={handleChange} className="p-2 border rounded" placeholder="Giá" required />
          <input type="number" name="quantity" value={form.quantity} onChange={handleChange} className="p-2 border rounded" placeholder="Số lượng" required />
        </div>

        <input name="category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Danh mục" />

        {user?.role === "admin" && (
          <select name="promotionId" value={form.promotionId} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">-- Khuyến mãi --</option>
            {promotions.map((p) => (
              <option key={p.id} value={p.id}>{p.title} (-{p.discount}%)</option>
            ))}
          </select>
        )}

        {/* Ảnh chính */}
        <div>
          <label className="block font-medium mb-1">Ảnh chính:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
          {previewImage && <img src={previewImage} alt="Preview" className="w-32 h-32 object-cover mt-2 border rounded" />}
        </div>

        {/* Ảnh phụ */}
        <div>
          <label className="block font-medium mb-1">Ảnh phụ hiện tại:</label>
          <ReactSortable list={existingImages} setList={handleReorderImages} className="flex flex-wrap gap-3">
            {existingImages.map((img) => (
              <div key={img.id} className="relative w-20 h-20 border rounded overflow-hidden bg-gray-100 group">
                <img src={`${SERVER_URL}${img.url}`} alt="Ảnh phụ" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveExistingImage(img.id);
                  }}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full z-10"
                >
                  ×
                </button>
              </div>
            ))}
          </ReactSortable>

          {/* Nút thêm ảnh phụ */}
          <div className="mt-4">
            <label className="inline-block bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded cursor-pointer">
              + Thêm ảnh phụ
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleUploadAtSlot}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4">Cập nhật sản phẩm</button>
      </form>
    </div>
  );
};

export default ProductEdit;
