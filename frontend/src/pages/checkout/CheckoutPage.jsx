import { useEffect, useState } from "react";
import API, { BASE_IMAGE_URL } from "../../axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "",
    province: "",
    district: "",
    ward: "",
    detailAddress: "",
    paymentMethod: "",
  });

  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [suggestions, setSuggestions] = useState([]);

  // 🛠 Lấy dữ liệu khi load trang
  useEffect(() => {
    fetchCart();
    fetchUserInfo();
    fetchDefaultAddress();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      const items = Array.isArray(res.data.items) ? res.data.items : [];
      setCartItems(items);
      calculateTotal(items);
    } catch {
      toast.error("❌ Lỗi khi tải giỏ hàng!");
    }
  };

  const fetchUserInfo = async () => {
    try {
      const res = await API.get("/auth/me");
      setUserInfo({ name: res.data.name, email: res.data.email });
    } catch {
      toast.error("❌ Không thể lấy thông tin người dùng.");
    }
  };

  const fetchDefaultAddress = async () => {
    try {
      const res = await API.get("/userAddress");
      const list = res.data || [];
      const def = list.find((a) => a.isDefault);
      if (def) {
        setFormData((prev) => ({
          ...prev,
          phone: def.phone || "",
          province: def.province || "",
          district: def.district || "",
          ward: def.ward || "",
          detailAddress: def.detailAddress || "",
        }));
      }
    } catch {
      toast.error("❌ Không thể tải địa chỉ mặc định.");
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      const price = item.Product?.finalPrice || 0;
      return sum + price * item.quantity;
    }, 0);
    setTotalPrice(total);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "detailAddress" && value.length > 3) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}`)
        .then((res) => res.json())
        .then((data) => setSuggestions(data.slice(0, 5)))
        .catch((err) => console.error("Nominatim error:", err));
    } else if (name === "detailAddress") {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (sug) => {
    setFormData((prev) => ({ ...prev, detailAddress: sug.display_name }));
    setSuggestions([]);
  };

  // 📦 Xử lý đặt hàng
  const handleCheckout = async () => {
    const { phone, province, district, ward, detailAddress, paymentMethod } = formData;
    if (!phone || !province || !district || !ward || !detailAddress) {
      return toast.error("Vui lòng điền đầy đủ thông tin địa chỉ.");
    }
    if (!paymentMethod) {
      return toast.error("Vui lòng chọn phương thức thanh toán.");
    }
    if (cartItems.length === 0) {
      return toast.error("Giỏ hàng trống, không thể đặt hàng.");
    }

    try {
      setIsLoading(true);
      await API.post("/orders", {
        name: userInfo.name,
        email: userInfo.email,
        phone,
        address: `${detailAddress}, ${ward}, ${district}, ${province}`,
        paymentMethod,
      });

      toast.success("✅ Đặt hàng thành công!");
      setCartItems([]);
      setTimeout(() => navigate("/orders/my"), 2000);
    } catch {
      toast.error("❌ Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen">
      <ToastContainer position="top-right" autoClose={2500} />
      <h1 className="text-3xl font-bold text-green-800 mb-8">🧾 Thanh toán đơn hàng</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 📍 Form địa chỉ */}
        <div className="space-y-4 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold text-green-800 mb-2">Thông tin người nhận</h2>

          <input type="text" value={userInfo.name} disabled className="w-full border px-4 py-2 rounded bg-gray-100" />
          <input type="text" value={userInfo.email} disabled className="w-full border px-4 py-2 rounded bg-gray-100" />

          <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Số điện thoại" className="w-full border px-4 py-2 rounded" />
          <input type="text" name="province" value={formData.province} onChange={handleChange} placeholder="Tỉnh / Thành phố" className="w-full border px-4 py-2 rounded" />
          <input type="text" name="district" value={formData.district} onChange={handleChange} placeholder="Quận / Huyện" className="w-full border px-4 py-2 rounded" />
          <input type="text" name="ward" value={formData.ward} onChange={handleChange} placeholder="Phường / Xã" className="w-full border px-4 py-2 rounded" />

          <div className="relative">
            <input type="text" name="detailAddress" value={formData.detailAddress} onChange={handleChange} placeholder="Số nhà, tên đường..." className="w-full border px-4 py-2 rounded" />
            {suggestions.length > 0 && (
              <ul className="absolute bg-white border mt-1 w-full max-h-48 overflow-auto rounded shadow z-10">
                {suggestions.map((sug, idx) => (
                  <li key={idx} className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => handleSelectSuggestion(sug)}>
                    {sug.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 🛒 Đơn hàng */}
        <div className="space-y-4 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold text-green-800 mb-2">Đơn hàng của bạn</h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-600 italic">Không có sản phẩm nào.</p>
          ) : (
            <>
              {cartItems.map((item) => {
                const product = item.Product;
                const imgSrc = product?.images?.[0]?.url || product?.image || "/fallback.jpg";

                return (
                  <div key={item.id} className="flex items-center gap-3 border p-2 rounded">
                    <img src={`${BASE_IMAGE_URL}${imgSrc}`} alt={product?.name} className="w-12 h-12 object-cover rounded" />
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{product?.name}</p>
                      <p className="text-green-700 text-sm">{item.quantity} x {product?.finalPrice?.toLocaleString()}đ</p>
                    </div>
                  </div>
                );
              })}

              <p className="text-right font-semibold text-green-800">Tổng cộng: {totalPrice.toLocaleString()}đ</p>

              {/* 📌 Dropdown phương thức thanh toán */}
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full border px-4 py-2 rounded">
                <option value="">-- Chọn phương thức thanh toán --</option>
                <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                <option value="bank_transfer">Chuyển khoản ngân hàng</option>
                <option value="credit_card">Thẻ tín dụng / ghi nợ</option>
              </select>

              {/* Nút đặt hàng */}
              <button onClick={handleCheckout} disabled={isLoading} className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded font-semibold shadow transition">
                {isLoading ? "⏳ Đang xử lý..." : "🛍️ Đặt hàng ngay"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
