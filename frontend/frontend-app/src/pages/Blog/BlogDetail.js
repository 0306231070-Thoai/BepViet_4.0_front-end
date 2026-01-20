import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/blogs/${id}`)
      .then(res => {
        setBlog(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!blog) return <p>Không tìm thấy bài viết</p>;

  return (
    <div className="blog-detail">
      <h1>{blog.title}</h1>

      <img
        src={`http://127.0.0.1:8000/storage/${blog.image}`}
        alt={blog.title}
      />

      <div
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
}
