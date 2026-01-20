import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BlogDetail = () => {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const imageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/1200x600";
    if (img.startsWith("http")) return img;
    return `http://localhost:8000/storage/${img}`;
  };

  /* ================= FETCH BLOG ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogRes = await fetch(
          `http://localhost:8000/api/blogs/${id}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        const blogJson = await blogRes.json();
        setBlog(blogJson.data);

        const cmtRes = await fetch(
          `http://localhost:8000/api/blogs/${id}/comments`
        );
        const cmtJson = await cmtRes.json();
        setComments(cmtJson);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* ================= COMMENT ================= */
  const submitComment = async () => {
    if (!content.trim()) return;

    const token = localStorage.getItem("token");

    await fetch(`http://localhost:8000/api/blogs/${id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    setContent("");
  };

  if (loading || !blog) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div className="container py-4">
      <div className="row">

        {/* ================= MAIN ================= */}
        <div className="col-lg-8">

          {/* Breadcrumb */}
          <nav className="breadcrumb small mb-3">
            <span className="breadcrumb-item text-muted">Blog</span>
            <span className="breadcrumb-item active">Chi tiết</span>
          </nav>

          {/* Title */}
          <h1 className="fw-bold display-6 mb-3">{blog.title}</h1>

          {/* Author */}
          <div className="author-meta d-flex align-items-center mb-4 text-muted">
            <img
              src={imageUrl(blog.user?.avatar)}
              className="rounded-circle me-3"
              width="48"
              height="48"
              alt=""
            />
            <div>
              <strong className="text-dark d-block">
                {blog.user?.username}
              </strong>
              <small>
                {new Date(blog.created_at).toLocaleDateString()}
              </small>
            </div>
          </div>

          {/* Header Image */}
          <img
            src={imageUrl(blog.image)}
            className="img-fluid rounded mb-4"
            alt={blog.title}
          />

          {/* Content */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* ================= COMMENTS ================= */}
          <hr className="my-5" />
          <h5 className="fw-bold mb-4">
            Bình luận ({comments.length})
          </h5>

          <textarea
            className="form-control mb-2"
            rows="3"
            placeholder="Chia sẻ ý kiến của bạn..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            className="btn btn-primary-cookpad btn-sm mb-4"
            onClick={submitComment}
          >
            Gửi bình luận
          </button>

          {comments.map((c) => (
            <div className="d-flex mb-3" key={c.id}>
              <img
                src={imageUrl(c.user?.avatar)}
                className="rounded-circle me-3"
                width="40"
                height="40"
                alt=""
              />
              <div>
                <strong>{c.user?.username}</strong>
                <p className="mb-1">{c.content}</p>
                <small className="text-muted">
                  {new Date(c.created_at).toLocaleString()}
                </small>
              </div>
            </div>
          ))}

        </div>

        {/* ================= SIDEBAR ================= */}
        <div className="col-lg-4">

          <div className="widget-card mb-4 text-center">
            <img
              src={imageUrl(blog.user?.avatar)}
              className="rounded-circle mb-3"
              width="80"
              height="80"
              alt=""
            />
            <h5 className="fw-bold">{blog.user?.username}</h5>
            <p className="text-muted small">
              Chuyên đi ăn và review quán ngon
            </p>
            <button className="btn btn-outline-primary btn-sm rounded-pill">
              Theo dõi
            </button>
          </div>

          <div className="widget-card">
            <h6 className="fw-bold mb-3">Bài viết liên quan</h6>
            <p className="text-muted small">
              (Sẽ load sau bằng API)
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
