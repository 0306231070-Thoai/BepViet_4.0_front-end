import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BlogFeed = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  const fetchBlogs = async (page) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/blog-feed?page=${page}`
      );
      const json = await res.json();

      setBlogs(json.data || []);
      setLastPage(json.last_page || 1);
    } catch (err) {
      console.error("Lỗi load blog:", err);
    } finally {
      setLoading(false);
    }
  };

  const imageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/500x350?text=No+Image";
    if (img.startsWith("http")) return img;
    return `http://localhost:8000/storage/${img}`;
  };

  return (
    <div className="container mt-4">
      <div className="row g-5">

        {/* ================= LEFT ================= */}
        <div className="col-lg-8">

          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">Bài viết mới nhất</h4>

            <select className="form-select form-select-sm w-auto">
              <option>Mới nhất</option>
              <option>Xem nhiều</option>
              <option>Review quán</option>
            </select>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-success" />
            </div>
          )}

          {/* EMPTY */}
          {!loading && blogs.length === 0 && (
            <p className="text-muted">Chưa có bài viết nào</p>
          )}

          {/* BLOG LIST */}
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="card mb-4 border-0 shadow-sm blog-card-horizontal"
            >
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src={imageUrl(blog.image)}
                    alt={blog.title}
                    className="img-fluid h-100 rounded-start object-fit-cover"
                  />
                </div>

                <div className="col-md-8">
                  <div className="card-body">

                    {/* CATEGORY */}
                    {blog.category && (
                      <span className="badge bg-light text-danger mb-2">
                        {blog.category.name}
                      </span>
                    )}

                    {/* TITLE */}
                    <h5 className="fw-bold mt-2">
                      <Link
                        to={`/blog/${blog.id}`}
                        className="text-dark text-decoration-none"
                      >
                        {blog.title}
                      </Link>
                    </h5>

                    {/* DESC */}
                    <p className="text-muted small line-clamp-2">
                      {blog.excerpt || blog.content}
                    </p>

                    {/* META */}
                    <div className="d-flex justify-content-between align-items-center mt-3">
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
            <nav className="mt-5">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${page === 1 && "disabled"}`}>
                  <button
                    className="page-link"
                    onClick={() => setPage(page - 1)}
                  >
                    Trước
                  </button>
                </li>

                {Array.from({ length: lastPage }).map((_, i) => (
                  <li
                    key={i}
                    className={`page-item ${page === i + 1 && "active"}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${page === lastPage && "disabled"}`}>
                  <button
                    className="page-link"
                    onClick={() => setPage(page + 1)}
                  >
                    Sau
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>

        {/* ================= RIGHT ================= */}
        <div className="col-lg-4">

          {/* SEARCH */}
          <div className="blog-widget p-4 mb-4 bg-white rounded-3 shadow-sm border">
            <h6 className="fw-bold mb-3">Tìm bài viết</h6>
            <div className="input-group">
              <input
                type="text"
                className="form-control bg-light border-0"
                placeholder="Từ khóa..."
              />
              <button className="btn btn-primary-cookpad">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </div>

          {/* CATEGORY */}
          <div className="blog-widget p-4 bg-white rounded-3 shadow-sm border">
            <h6 className="fw-bold mb-3">Chuyên mục</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">🍜 Review Quán Ăn</li>
              <li className="mb-2">💡 Mẹo Vặt Nhà Bếp</li>
              <li className="mb-2">🥗 Eat Clean</li>
              <li>✈️ Du Lịch Ẩm Thực</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BlogFeed;
