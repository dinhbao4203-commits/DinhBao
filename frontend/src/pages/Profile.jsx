import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import AddressPicker from "../components/AddressPicker"; // <-- thêm

export default function Profile() {
  const { updateUser } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Thông tin cá nhân
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Địa chỉ
  const [addressId, setAddressId] = useState(null);
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const res = await axiosInstance.get("/users/me");
        if (!isMounted) return;
        if (res.data) {
          setName(res.data.name || "");
          setEmail(res.data.email || "");
        }
      } catch (err) {
        if (!isMounted) return;
        const code = err?.response?.status;
        if (!code || code >= 500) showToast("Lỗi khi tải thông tin cá nhân", "error");
      }
    };

    const loadDefaultAddress = async () => {
      try {
        const res = await axiosInstance.get("/userAddress/my");
        if (!isMounted) return;

        const list = Array.isArray(res.data) ? res.data : [];
        if (list.length === 0) return; // im lặng nếu chưa có

        const def = list.find((a) => a.isDefault) || list[0];
        if (def) {
          setAddressId(def.id);
          setPhone(def.phone || "");
          setProvince(def.province || "");
          setDistrict(def.district || "");
          setWard(def.ward || "");
          setDetailAddress(def.detailAddress || "");
        }
      } catch (err) {
        if (!isMounted) return;
        const code = err?.response?.status;
        if (code && (code === 404 || code === 204)) return; // im lặng
        showToast("Lỗi khi tải địa chỉ", "error");
      }
    };

    Promise.allSettled([loadUser(), loadDefaultAddress()]).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const handleSaveAll = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (!phone || !province || !district || !ward || !detailAddress) {
      return showToast("Vui lòng nhập đủ thông tin địa chỉ.", "error");
    }

    try {
      setSaving(true);

      // 1) cập nhật thông tin cá nhân
      await axiosInstance.put("/users/me", { name, email });

      // 2) cập nhật hoặc tạo địa chỉ mặc định
      if (addressId) {
        await axiosInstance.put(`/userAddress/${addressId}`, {
          phone,
          province,
          district,
          ward,
          detailAddress,
          isDefault: true,
        });
      } else {
        await axiosInstance.post("/userAddress", {
          phone,
          province,
          district,
          ward,
          detailAddress,
          isDefault: true,
        });
      }

      // 3) cập nhật ngay context + localStorage để Header đổi tức thì
      updateUser?.({ name, email });

      showToast("Cập nhật thông tin thành công", "success");
    } catch (err) {
      showToast("Cập nhật thất bại. Vui lòng thử lại.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Thông tin cá nhân</h1>

      <form onSubmit={handleSaveAll} className="space-y-8">
        {/* Thông tin cá nhân */}
        <section className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Họ tên</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </section>

        {/* Địa chỉ */}
        <section>
          <h2 className="text-xl font-bold mb-4">Địa chỉ mặc định</h2>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Số điện thoại</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {/* Dropdown tỉnh–huyện–xã */}
            <AddressPicker
              province={province}
              district={district}
              ward={ward}
              onChange={(patch) => {
                if (patch.province !== undefined) setProvince(patch.province);
                if (patch.district !== undefined) setDistrict(patch.district);
                if (patch.ward !== undefined) setWard(patch.ward);
              }}
            />

            <div>
              <label className="block font-semibold mb-1">Địa chỉ chi tiết</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                required
              />
            </div>
          </div>
        </section>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className={`bg-green-700 text-white px-5 py-2 rounded ${
              saving ? "opacity-70 cursor-not-allowed" : "hover:bg-green-800"
            }`}
          >
            {saving ? "Đang cập nhật..." : "Cập nhật thông tin"}
          </button>
        </div>
      </form>
    </div>
  );
}
