import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../axiosInstance";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await API.post("/auth/login", { email, password });

      if (res.data?.token && res.data?.user) {
        // Gộp token và user thành 1 object đầy đủ
        const userData = {
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          role: res.data.user.role,
          token: res.data.token,
        };

        login(userData); // Lưu vào Context & localStorage
        navigate("/"); // Điều hướng sau khi đăng nhập
      } else {
        throw new Error("Dữ liệu trả về từ server không hợp lệ");
      }
    } catch (err) {
      console.error("[Login] Lỗi đăng nhập:", err);
      if (err.response) {
        setError(err.response.data?.message || "Đăng nhập thất bại!");
      } else if (err.request) {
        setError("Không thể kết nối tới server!");
      } else {
        setError(err.message || "Đã xảy ra lỗi không xác định!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-4">
        Đăng nhập
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
          required
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-white py-2 rounded ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
