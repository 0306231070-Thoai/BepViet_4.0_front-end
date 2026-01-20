import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const imageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/900x450";
    if (img.startsWith("http")) return img;
    return `http://localhost:8000/storage/${img}`;
  };

  const fetchBlog = useCallback(async () => {
    const res = await fetch(`http://localhost:8000/api/blogs/${id}`);
    const json = await res.json();
    setBlog(json.data);
    setLoading(false);
  }, [id]);

  const fetchComments = useCallback(async () => {
    const res = await fetch(
      `http://localhost:8000/api/blogs/${id}/comments`
    );
    const json = await res.json();
    setComments(json);
  }, [id]);

  useEffect(() => {
    fetchBlog();
    fetchComments();
  }, [fetchBlog, fetchComments]);

  const submitComment = async () => {
    if (!content.trim()) return;

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8000/api/blogs/${id}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      }
    );

    if (res.ok) {
      setContent("");
      fetchComments();
    }
  };

  if (loading)
    return <div className="text-center py-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8">

          <h1 className="fw-bold mb-3">{blog.title}</h1>

          <div className="d-flex align-items-center text-muted mb-3">
            <img
              src={imageUrl(blog.user?.avatar)}
              alt=""
              className="rounded-circle me-2"
              width="40"
              height="40"
            />
            <small>
              {blog.user?.username} •{" "}
              {new Date(blog.created_at).toLocaleDateString()}
            </small>
          </div>

          <img
            src={imageUrl(blog.image)}
            alt={blog.title}
            className="img-fluid rounded mb-4"
          />

          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* COMMENTS */}
          <hr className="my-5" />
          <h5 className="fw-bold mb-3">
            Bình luận ({comments.length})
          </h5>

          {/* ADD COMMENT */}
          <textarea
            className="form-control mb-2"
            rows="3"
            placeholder="Viết bình luận..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            className="btn btn-primary mb-4"
            onClick={submitComment}
          >
            Gửi bình luận
          </button>

          {/* LIST */}
          {comments.map((c) => (
            <div key={c.id} className="d-flex mb-3">
              <img
                src={imageUrl(c.user?.avatar)}
                alt=""
                className="rounded-circle me-3"
                width="40"
                height="40"
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
      </div>
    </div>
  );
};

export default BlogDetail;
