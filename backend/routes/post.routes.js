const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const { verifyToken } = require("../middleware/auth.middleware");
const { allowRoles } = require("../middleware/role.middleware");
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
} = require("../controllers/post.controller");

// CRUD bài viết
router.post("/", verifyToken, allowRoles("admin", "staff"), upload.single("image"), createPost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.put("/:id", verifyToken, allowRoles("admin", "staff"), upload.single("image"), updatePost);
router.delete("/:id", verifyToken, allowRoles("admin", "staff"), deletePost);

module.exports = router;
