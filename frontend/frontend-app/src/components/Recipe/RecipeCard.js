import React from "react";
import { Link, useNavigate } from "react-router-dom";

function RecipeCard({
  id,
  title,
  main_image,
  status,
  created_at,
  difficulty,
  cooking_time,
  servings,
  category,
  ingredients_count,
  steps_count,
  onDelete,
}) {
  const navigate = useNavigate();

  // Token cố định để test
  const token = "YiTJ3oZgIt";

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa công thức này?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/recipes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("Xóa thành công!");
        if (onDelete) onDelete(id);
      } else {
        alert("Không thể xóa công thức.");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối API.");
    }
  };

  const getImageUrl = (img) => {
    if (!img) return "/no-image.png"; // ảnh mặc định trong public
    return `http://127.0.0.1:8000/storage/${img}`;
  };

  return (
    <div className="card h-100 shadow-sm border-0">
      <img
        src={getImageUrl(main_image)}
        className="card-img-top"
        alt={title}
        style={{ height: "180px", objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title fw-bold mb-0">
            <Link to={`/recipes/${id}`} className="text-decoration-none text-dark">
              {title}
            </Link>
          </h5>
          <span
            className={`badge ${
              status === "Published"
                ? "bg-success"
                : status === "Pending"
                ? "bg-warning text-dark"
                : "bg-secondary"
            }`}
          >
            {status}
          </span>
        </div>
        <p className="text-muted small mb-2">{created_at}</p>

        <div className="text-muted small mb-2">
          <div>🍽 Khẩu phần: {servings}</div>
          <div>⏱ Thời gian: {cooking_time} phút</div>
          <div>🎚 Độ khó: {difficulty}</div>
          {category?.name && <div>📂 Danh mục: {category.name}</div>}
        </div>

        <div className="mt-auto d-flex justify-content-between align-items-center">
          <div className="text-muted small d-flex gap-3">
            <span>
              <i className="fa-solid fa-carrot text-warning"></i> {ingredients_count} NL
            </span>
            <span>
              <i className="fa-solid fa-list-ol text-danger"></i> {steps_count} bước
            </span>
          </div>
          <div className="btn-group">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => navigate(`/recipes/${id}/edit`)}
            >
              <i className="fa-solid fa-pen"></i>
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() =>
                navigator.clipboard.writeText(window.location.origin + `/recipes/${id}`)
              }
            >
              <i className="fa-solid fa-share-nodes"></i>
            </button>
            <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
              <i className="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
