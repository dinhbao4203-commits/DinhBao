
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("Post", {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING
    },
    author: {
      type: DataTypes.STRING
    }
  }, {
    tableName: "posts",
    timestamps: true
  });

  return Post;
};
