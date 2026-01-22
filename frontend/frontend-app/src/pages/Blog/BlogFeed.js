import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

const BlogFeed = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/blog-feed?page=${page}&search=${encodeURIComponent(
          search
        )}`
      );
      const data = await res.json();

      setBlogs(data.data || []);
      setLastPage(data.last_page || 1);
    } catch (err) {
      console.error("Lỗi load blog:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Hàm lấy URL ảnh, nếu không có ảnh thì trả về ảnh mặc định
  const imageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/500x350?text=No+Image";
    return url;
  };


  return (
    <div className="container mt-4">
      <div className="row g-5">
        {/* LEFT */}
        <div className="col-lg-8">
          <h4 className="fw-bold mb-4">Bài viết mới nhất</h4>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-success" />
            </div>
          )}

          {!loading && blogs.length === 0 && (
            <p className="text-muted">Chưa có bài viết nào</p>
          )}

          {blogs.map((blog) => (
            <div key={blog.id} className="card mb-4 shadow-sm border-0">
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src={imageUrl(blog.image_url)}
                    alt={blog.title || ""}
                    className="img-fluid h-100 rounded-start object-fit-cover"
                  />
                </div>

                <div className="col-md-8">
                  <div className="card-body">
                    {blog.category && (
                      <span className="badge bg-light text-danger">
                        {blog.category.name}
                      </span>
                    )}

                    <h5 className="fw-bold mt-2">
                      <Link
                        to={`/blogs/${blog.id}`}
                        className="text-dark text-decoration-none"
                      >
                        {blog.title}
                      </Link>
                    </h5>

                    <p className="text-muted small">{blog.excerpt}</p>

                    <div className="d-flex justify-content-between">
                      <small className="text-muted">
                        👤 {blog.user?.username || "Ẩn danh"}
                      </small>
                      <small className="text-muted">
                        {new Date(blog.created_at).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* PAGINATION */}
          {lastPage > 1 && (
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Trước
                  </button>
                </li>

                {Array.from({ length: lastPage }).map((_, i) => (
                  <li
                    key={i}
                    className={`page-item ${page === i + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${
                    page === lastPage ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Sau
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>

        {/* RIGHT */}
        <div className="col-lg-4">
          <div className="p-4 bg-white shadow-sm rounded">
            <h6 className="fw-bold mb-3">Tìm bài viết</h6>
            <input
              className="form-control bg-light"
              placeholder="Nhập từ khóa..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogFeed;
