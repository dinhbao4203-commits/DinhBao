import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../axiosInstance";

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "guest",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get(`/users/${id}`);
        setFormData({
          username: res.data.username,
          email: res.data.email,
          password: "",
          role: res.data.role,
        });
      } catch (err) {
        console.error("Lỗi tải user:", err);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/users/${id}`, formData);
      navigate("/admin/users");
    } catch (err) {
      console.error("Lỗi cập nhật user:", err);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-green-900 mb-4">Sửa User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Tên"
          value={formData.username}
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
          placeholder="Để trống nếu không đổi"
          value={formData.password}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
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
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg shadow"
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default UserEdit;
