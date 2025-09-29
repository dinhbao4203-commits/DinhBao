const db = require("../models");
const Post = db.post;

const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const author = req.user?.email || "Unknown";

    let imagePath = null;
    if (req.file) {
      imagePath = "/uploads/" + req.file.filename;
    }

    const post = await Post.create({
      title, content, category, image: imagePath, author
    });

    res.status(201).json({ message: "Thêm bài viết thành công!", post });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tạo bài viết!", error: err.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách bài viết!" });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết!" });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết!" });

    let imagePath = post.image;
    if (req.file) {
      imagePath = "/uploads/" + req.file.filename;
    }

    await post.update({ title, content, category, image: imagePath });

    res.status(200).json({ message: "Cập nhật bài viết thành công!", post });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật bài viết!" });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết!" });

    await post.destroy();
    res.status(200).json({ message: "Đã xoá bài viết." });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá bài viết!" });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
};
