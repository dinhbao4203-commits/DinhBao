import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../axiosInstance";

const UserCreate = () => {
  const [formData, setFormData] = useState({
    name: "", // ✅ khớp model
    email: "",
    password: "",
    role: "guest",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      await API.post("/users", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      alert("✅ Tạo user thành công");
      navigate("/admin/users");
    } catch (err) {
      console.error("Lỗi tạo user:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Không thể tạo user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-green-900 mb-4">Thêm User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Tên"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="guest">Guest</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "bg-gray-400" : "bg-green-700 hover:bg-green-800"
          } text-white px-4 py-2 rounded-lg shadow w-full`}
        >
          {loading ? "Đang lưu..." : "Lưu"}
        </button>
      </form>
    </div>
  );
};

export default UserCreate;
