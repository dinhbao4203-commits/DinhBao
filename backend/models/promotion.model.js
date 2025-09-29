module.exports = (sequelize, DataTypes) => {
  const Promotion = sequelize.define("Promotion", {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: "promotions",
    timestamps: true
  });

  return Promotion;
};
