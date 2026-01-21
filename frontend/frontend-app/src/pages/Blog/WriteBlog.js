import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WriteBlog = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để viết blog");
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert("Vui lòng nhập đầy đủ tiêu đề và nội dung");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      setLoading(true);

      await axios.post(
        "http://127.0.0.1:8000/api/blogs",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("🎉 Đăng blog thành công");
      navigate("/blog-feed"); // quay về feed
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi đăng blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 800 }}>
      <h2 className="fw-bold mb-4">✍️ Viết bài blog</h2>

      <form onSubmit={handleSubmit}>
        {/* TITLE */}
        <div className="mb-3">
          <label className="form-label fw-bold">Tiêu đề</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tiêu đề bài viết..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* CONTENT */}
        <div className="mb-3">
          <label className="form-label fw-bold">Nội dung</label>
          <textarea
            className="form-control"
            rows="10"
            placeholder="Nhập nội dung bài viết..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* IMAGE */}
        <div className="mb-4">
          <label className="form-label fw-bold">Ảnh bìa</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="btn btn-success px-4"
          disabled={loading}
        >
          {loading ? "Đang đăng..." : "Đăng bài"}
        </button>
      </form>
    </div>
  );
};

export default WriteBlog;
