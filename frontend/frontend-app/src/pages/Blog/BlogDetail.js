import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/blogs/${id}`)
      .then(res => {
        setBlog(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const submitComment = async () => {
    if (!content.trim()) return;

    const token = localStorage.getItem("token");

    const res = await axios.post(
      `http://127.0.0.1:8000/api/blogs/${id}/comments`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setBlog({
      ...blog,
      comments: [res.data, ...blog.comments]
    });

    setContent("");
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (!blog) return <div className="text-center py-5">Không tìm thấy bài viết</div>;

  return (
    <div className="container py-5 blog-detail">
      <h1 className="fw-bold mb-4">{blog.title}</h1>

      {blog.image && (
        <img
          src={`http://127.0.0.1:8000/storage/${blog.image}`}
          alt={blog.title}
          className="img-fluid rounded mb-4"
        />
      )}

      <div dangerouslySetInnerHTML={{ __html: blog.content }} />

      {/* COMMENTS */}
      <hr className="my-5" />

      <h4 className="fw-bold mb-4">
        Bình luận ({blog.comments?.length || 0})
      </h4>

      {/* FORM */}
      {localStorage.getItem("token") && (
        <div className="d-flex mb-4">
          <img
            src="https://via.placeholder.com/40"
            className="rounded-circle me-3"
            alt=""
          />
          <div className="w-100">
            <textarea
              className="form-control mb-2"
              rows="2"
              placeholder="Chia sẻ ý kiến của bạn..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              className="btn btn-success btn-sm"
              onClick={submitComment}
            >
              Gửi bình luận
            </button>
          </div>
        </div>
      )}

      {/* LIST */}
      {blog.comments?.length === 0 && (
        <p className="text-muted">Chưa có bình luận nào</p>
      )}

      {blog.comments?.map(c => (
        <div className="mb-4" key={c.id}>
          <div className="d-flex">
            <img
              src={`http://127.0.0.1:8000/storage/${c.user?.avatar}`}
              className="rounded-circle me-3"
              width="40"
              height="40"
              alt=""
            />
            <div>
              <strong>{c.user?.username}</strong>
              <div className="text-muted small">
                {new Date(c.created_at).toLocaleString()}
              </div>
              <p className="mb-0">{c.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
