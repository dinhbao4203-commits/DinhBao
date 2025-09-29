const db = require("../models");
const userAddress = db.userAddress;

// 👉 Lấy danh sách địa chỉ của user hiện tại (mặc định ưu tiên isDefault)
exports.getMyAddresses = async (req, res) => {
  try {
    const addresses = await userAddress.findAll({
      where: { userId: req.user.id },
      order: [["isDefault", "DESC"], ["createdAt", "DESC"]],
    });
    res.json(addresses);
  } catch (error) {
    console.error("Lỗi khi lấy địa chỉ:", error);
    res.status(500).json({ message: "Đã có lỗi xảy ra." });
  }
};

// 👉 Thêm địa chỉ mới
exports.addAddress = async (req, res) => {
  try {
    const { phone, province, district, ward, detailAddress, isDefault } = req.body;
    const userId = req.user.id;

    if (!phone || !province || !district || !ward || !detailAddress) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin địa chỉ." });
    }

    const address = `${detailAddress}, ${ward}, ${district}, ${province}`;

    if (isDefault) {
      await userAddress.update({ isDefault: false }, { where: { userId } });
    }

    const newAddress = await userAddress.create({
      userId,
      phone,
      province,
      district,
      ward,
      detailAddress,
      address,
      isDefault: !!isDefault,
    });

    res.status(201).json(newAddress);
  } catch (err) {
    console.error("Lỗi khi thêm địa chỉ:", err);
    res.status(500).json({ message: "Đã có lỗi xảy ra." });
  }
};

// 👉 Cập nhật địa chỉ
exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;
    const { phone, province, district, ward, detailAddress, isDefault } = req.body;

    const addressToUpdate = await userAddress.findOne({ where: { id: addressId, userId } });
    if (!addressToUpdate) {
      return res.status(404).json({ message: "Không tìm thấy địa chỉ." });
    }

    const address = `${detailAddress}, ${ward}, ${district}, ${province}`;

    if (isDefault) {
      await userAddress
      .update({ isDefault: false }, { where: { userId } });
    }

    await addressToUpdate.update({
      phone, province, district, ward, detailAddress, address, isDefault: !!isDefault,
    });

    res.json(addressToUpdate);
  } catch (err) {
    console.error("Lỗi khi cập nhật địa chỉ:", err);
    res.status(500).json({ message: "Đã có lỗi xảy ra." });
  }
};

// 👉 Xoá địa chỉ
exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const address = await userAddress.findOne({ where: { id: addressId, userId } });
    if (!address) {
      return res.status(404).json({ message: "Không tìm thấy địa chỉ." });
    }

    await address.destroy();
    res.json({ message: "Đã xoá địa chỉ thành công." });
  } catch (err) {
    console.error("Lỗi khi xoá địa chỉ:", err);
    res.status(500).json({ message: "Đã có lỗi xảy ra." });
  }
};

// 👉 Lấy 1 địa chỉ theo ID
exports.getAddressById = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const address = await userAddress.findOne({ where: { id: addressId, userId } });
    if (!address) {
      return res.status(404).json({ message: "Không tìm thấy địa chỉ." });
    }

    res.json(address);
  } catch (err) {
    console.error("Lỗi khi lấy địa chỉ:", err);
    res.status(500).json({ message: "Đã có lỗi xảy ra." });
  }
};
