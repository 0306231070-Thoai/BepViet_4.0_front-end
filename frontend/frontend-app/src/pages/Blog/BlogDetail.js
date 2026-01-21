import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

const BlogDetail = () => {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newComment, setNewComment] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

  // ⚠️ giả sử bạn đã lưu user đăng nhập
  const authUserId = Number(localStorage.getItem("user_id"));
  const token = localStorage.getItem("token");

  /* ================== HELPERS ================== */
  const imageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/900x500?text=No+Image";
    if (img.startsWith("http")) return img;
    return `http://localhost:8000/storage/${img}`;
  };

  const avatarUrl = (img) => {
    if (!img) return "https://i.pravatar.cc/100";
    if (img.startsWith("http")) return img;
    return `http://localhost:8000/storage/${img}`;
  };

  /* ================== FETCH BLOG ================== */
  const fetchBlog = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/blogs/${id}`);
      const data = await res.json();

      setBlog(data);
      setComments(data.comments || []);

      // nếu backend có trả trạng thái follow
      if (data.is_following !== undefined) {
        setIsFollowing(data.is_following);
      }
    } catch (err) {
      console.error("Lỗi load blog:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  /* ================== FOLLOW ================== */
  const handleFollow = async () => {
    if (!token) {
      alert("Bạn cần đăng nhập");
      return;
    }

    try {
      await fetch(
        `http://localhost:8000/api/follow/${blog.user.id}`,
        {
          method: isFollowing ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Lỗi follow:", err);
    }
  };

  /* ================== COMMENT ================== */
  const submitComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/blogs/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newComment }),
        }
      );

      const comment = await res.json();
      setComments([comment, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Lỗi gửi comment:", err);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  /* ================== UI ================== */
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" />
      </div>
    );
  }

  if (!blog) return <p className="text-center">Không tìm thấy bài viết</p>;

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-9">

          {/* IMAGE */}
          <img
            src={imageUrl(blog.image)}
            alt={blog.title}
            className="img-fluid rounded mb-4"
          />

          {/* TITLE */}
          <h1 className="fw-bold mb-3">{blog.title}</h1>

          {/* AUTHOR + FOLLOW */}
          <div className="d-flex align-items-center mb-4">
            <img
              src={avatarUrl(blog.user?.avatar)}
              alt="avatar"
              className="rounded-circle me-3"
              width={48}
              height={48}
            />

            <div className="flex-grow-1">
              <strong>{blog.user?.username}</strong>
              <div className="text-muted small">
                {new Date(blog.created_at).toLocaleDateString()}
              </div>
            </div>

            {blog.user?.id !== authUserId && (
              <button
                className={`btn btn-sm ${
                  isFollowing
                    ? "btn-outline-secondary"
                    : "btn-success"
                }`}
                onClick={handleFollow}
              >
                {isFollowing ? "Đang theo dõi" : "Theo dõi"}
              </button>
            )}
          </div>

          {/* CONTENT */}
          <div
            className="blog-content mb-5"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* COMMENTS */}
          <hr />
          <h5 className="fw-bold mb-3">Bình luận</h5>

          {/* COMMENT FORM */}
          {token && (
            <div className="mb-4">
              <textarea
                className="form-control mb-2"
                rows={3}
                placeholder="Viết bình luận..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                className="btn btn-success btn-sm"
                onClick={submitComment}
              >
                Gửi bình luận
              </button>
            </div>
          )}

          {/* COMMENT LIST */}
          {comments.length === 0 && (
            <p className="text-muted">Chưa có bình luận</p>
          )}

          {comments.map((c) => (
            <div key={c.id} className="mb-3 border-bottom pb-3">
              <div className="d-flex align-items-center mb-1">
                <img
                  src={avatarUrl(c.user?.avatar)}
                  alt={c.user?.username}
                  className="rounded-circle me-2"
                  width={32}
                  height={32}
                />
                <strong className="me-2">{c.user?.username}</strong>
                <small className="text-muted">
                  {new Date(c.created_at).toLocaleDateString()}
                </small>
              </div>
              <div>{c.content}</div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
