module.exports = (sequelize, DataTypes) => {
  const UserAddress = sequelize.define("UserAddress", {
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ward: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    detailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: "user_addresses",
    timestamps: true,
  });

  UserAddress.associate = (models) => {
    UserAddress.belongsTo(models.user, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };

  return UserAddress;
};
