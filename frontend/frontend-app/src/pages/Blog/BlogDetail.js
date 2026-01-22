import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

const BlogDetail = () => {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));


  const avatarUrl = (img) => {
    if (!img) return "https://i.pravatar.cc/100";
    if (img.startsWith("http")) return img;
    return `http://localhost:8000/storage/${img}`;
  };


  const fetchBlog = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/blogs/${id}`);
      const data = await res.json();

      setBlog(data);
      setComments(data.comments || []);
      if (data.user?.is_following !== undefined) {
        setIsFollowing(data.user.is_following);
      }
    } catch (err) {
      console.error("Load blog error:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);


  const handleFollow = async () => {
    if (!token || !blog?.user) {
      alert("Bạn cần đăng nhập");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/api/follow/${blog.user.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await res.json();
      setIsFollowing(data.isFollowing);
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  // Gửi bình luận
  const submitComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/blogs/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newComment }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Gửi bình luận thất bại");
        return;
      }

      const comment = await res.json();
      setComments((prev) => [comment, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

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
      {/* IMAGE */}
      {blog.image_url && (
        <img
          src={blog.image_url}
          alt={blog.title}
          className="img-fluid rounded mb-4"
        />
      )}

      {/* TITLE */}
      <h1 className="fw-bold">{blog.title}</h1>

      {/* AUTHOR + FOLLOW */}
      <div className="d-flex align-items-center my-3">
        <img
          src={avatarUrl(blog.user?.avatar)}
          alt={blog.user?.username || ""}
          className="rounded-circle me-3"
          width={48}
          height={48}
        />

        <strong>{blog.user?.username}</strong>

        {user && blog.user?.id !== user.id && (
          <button
            className={`btn btn-sm ms-auto ${
              isFollowing ? "btn-outline-secondary" : "btn-success"
            }`}
            onClick={handleFollow}
          >
            {isFollowing ? "Đang theo dõi" : "Theo dõi"}
          </button>
        )}
      </div>

      {/* CONTENT */}
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />

      {/* COMMENTS */}
      <hr />
      <h5>Bình luận</h5>

      {token && (
        <div className="mb-3">
          <textarea
            className="form-control mb-2"
            rows={3}
            placeholder="Viết bình luận..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className="btn btn-success btn-sm" onClick={submitComment}>
            Gửi
          </button>
        </div>
      )}

      {comments.length === 0 && (
        <p className="text-muted">Chưa có bình luận</p>
      )}

      {comments.map((c) => (
        <div key={c.id} className="mt-3 border-bottom pb-2">
          <strong>{c.user?.username}</strong>
          <div>{c.content}</div>
        </div>
      ))}
    </div>
  );
};

export default BlogDetail;
