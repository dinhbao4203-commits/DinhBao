import { useEffect, useState } from "react";

export default function AddressPicker({ province, district, ward, onChange }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Tải toàn bộ cây hành chính VN (depth=3)
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=3")
      .then((r) => r.json())
      .then(setProvinces)
      .catch(() => setProvinces([]));
  }, []);

  // Province -> districts
  useEffect(() => {
    const p = provinces.find((x) => x.name === province);
    setDistricts(p ? p.districts : []);
    setWards([]);
  }, [province, provinces]);

  // District -> wards
  useEffect(() => {
    const p = provinces.find((x) => x.name === province);
    const d = p?.districts?.find((x) => x.name === district);
    setWards(d ? d.wards : []);
  }, [district, province, provinces]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block font-semibold mb-1">Tỉnh / Thành phố</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={province}
          onChange={(e) =>
            onChange({ province: e.target.value, district: "", ward: "" })
          }
        >
          <option value="">-- Chọn tỉnh/thành --</option>
          {provinces.map((p) => (
            <option key={p.code} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1">Quận / Huyện</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={district}
          onChange={(e) => onChange({ district: e.target.value, ward: "" })}
          disabled={!province}
        >
          <option value="">{province ? "-- Chọn quận/huyện --" : "Chọn tỉnh trước"}</option>
          {districts.map((d) => (
            <option key={d.code} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1">Phường / Xã</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={ward}
          onChange={(e) => onChange({ ward: e.target.value })}
          disabled={!district}
        >
          <option value="">{district ? "-- Chọn phường/xã --" : "Chọn quận trước"}</option>
          {wards.map((w) => (
            <option key={w.code} value={w.name}>
              {w.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
