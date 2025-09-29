import React, { useContext, useState, useEffect } from "react";
import API from "../../axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ReactSortable } from "react-sortablejs";

const ProductCreate = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    promotionId: ""
  });

  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await API.get("/promotions");
        setPromotions(res.data);
      } catch (err) {
        console.error("Không thể tải khuyến mãi");
      }
    };
    if (user?.role === "admin") fetchPromotions();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const withPreview = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages((prev) => [...prev, ...withPreview]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) return toast.error("Vui lòng chọn ảnh chính.");
    if (images.length < 4) return toast.error("Cần ít nhất 4 ảnh phụ!");

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });
      formData.append("image", image);

      const res = await API.post("/products", formData);
      const productId = res.data.product.id;

      const imageData = new FormData();
      images.forEach((img) => imageData.append("images", img.file));
      await API.post(`/products/${productId}/images`, imageData);

      toast.success("Đã thêm sản phẩm thành công!");
      navigate("/products");
    } catch (err) {
      toast.error("Thêm sản phẩm thất bại!");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Thêm sản phẩm</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Tên sản phẩm"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Mô tả"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={4}
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            placeholder="Giá (VND)"
            value={form.price}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Số lượng"
            value={form.quantity}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
        </div>

        <input
          type="text"
          name="category"
          placeholder="Danh mục"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {user?.role === "admin" && (
          <select
            name="promotionId"
            value={form.promotionId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Chọn khuyến mãi (nếu có) --</option>
            {promotions.map((promo) => (
              <option key={promo.id} value={promo.id}>
                {promo.title} (-{promo.discount}%)
              </option>
            ))}
          </select>
        )}

        {/* Ảnh chính */}
        <div>
          <label className="block font-medium mb-1">Ảnh chính:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
            required
          />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Thumbnail"
              className="w-32 h-32 object-cover mt-2 rounded border"
            />
          )}
        </div>

        {/* Ảnh phụ */}
        <div>
          <label className="block font-medium mb-1">Ảnh phụ (ít nhất 4 ảnh):</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImagesChange}
            className="w-full"
          />
          {images.length > 0 && (
            <ReactSortable
              list={images}
              setList={setImages}
              className="flex flex-wrap gap-2 mt-2 mb-4"
            >
              {images.map((img, i) => (
                <div
                  key={img.preview}
                  className="relative w-20 h-20 border rounded overflow-hidden bg-gray-100 flex items-center justify-center"
                >
                  <img
                    src={img.preview}
                    alt={`Ảnh phụ ${i + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    title="Xoá ảnh"
                  >
                    ×
                  </button>
                </div>
              ))}
            </ReactSortable>
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4"
        >
          Thêm sản phẩm
        </button>
      </form>
    </div>
  );
};

export default ProductCreate;
