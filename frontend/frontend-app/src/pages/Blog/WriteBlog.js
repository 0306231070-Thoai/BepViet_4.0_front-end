import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const WriteBlog = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    status: "published",
    category_id: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
// Gửi bài viết
  const submit = async () => {
    if (!token) return alert("Bạn cần đăng nhập");

    setLoading(true);
    const fd = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key]) fd.append(key, form[key]);
    });

    if (image) fd.append("image", image);
// Gửi yêu cầu tạo bài viết
    try {
      const res = await fetch("http://localhost:8000/api/blogs", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        alert(data.message || "Lỗi tạo bài viết");
        return;
      }

      navigate(`/blogs/${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Lỗi mạng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="fw-bold mb-3">Viết bài mới</h4>

      <input
        className="form-control mb-2"
        placeholder="Tiêu đề"
        name="title"
        value={form.title}
        onChange={handleChange}
      />

      <textarea
        className="form-control mb-2"
        placeholder="Mô tả ngắn"
        name="excerpt"
        value={form.excerpt}
        onChange={handleChange}
      />

      <textarea
        className="form-control mb-2"
        rows={8}
        placeholder="Nội dung"
        name="content"
        value={form.content}
        onChange={handleChange}
      />

      <select
        className="form-select mb-2"
        name="status"
        value={form.status}
        onChange={handleChange}
      >
        <option value="published">Công khai</option>
        <option value="draft">Bản nháp</option>
      </select>

      <input
        type="file"
        className="form-control mb-3"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button
        className="btn btn-success"
        disabled={loading}
        onClick={submit}
      >
        {loading ? "Đang lưu..." : "Đăng bài"}
      </button>
    </div>
  );
};

export default WriteBlog;
