import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function RecipeDetail() {
  // ================== LẤY ID TỪ URL ==================
  const { id } = useParams();

  // ================== STATE ==================
  const [recipe, setRecipe] = useState(null); // Lưu dữ liệu công thức
  const [loading, setLoading] = useState(true); // Kiểm soát trạng thái loading
  const [error, setError] = useState(null); // Lưu thông báo lỗi (nếu có)

  // ================== FETCH API ==================
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/recipes/${id}`);
        const data = await res.json();

        if (data && typeof data === "object" && data.data) {
          setRecipe(data.data);
        } else {
          setRecipe(data);
        }
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        setError("Không thể tải công thức. Vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  // ================== LOADING STATE ==================
  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
      <div className="spinner-border text-danger" role="status">
        <span className="visually-hidden">Đang tải...</span>
      </div>
    </div>
  );

  // ================== ERROR STATE ==================
  if (error) return (
    <div className="alert alert-danger text-center mt-4" role="alert">
      {error}
    </div>
  );

  // ================== KHÔNG TÌM THẤY ==================
  if (!recipe) return <p className="text-center mt-5">Không tìm thấy công thức.</p>;

  return (
    <div className="container mt-4">
      <div className="row g-5">
        
        {/* ================== CỘT TRÁI: Nội dung chính ================== */}
        <div className="col-lg-8">
          {/* Tiêu đề món ăn */}
          <h1 className="fw-bold mb-3 display-5">{recipe.title}</h1>

          {/* Tác giả + ngày đăng */}
          <div className="d-flex align-items-center mb-4">
            <img
              src={recipe.user?.avatar || "https://via.placeholder.com/30"}
              className="rounded-circle me-2"
              style={{ width: 30, height: 30 }}
              alt="avatar"
            />
            <span className="fw-bold me-3">{recipe.user?.name || "Ẩn danh"}</span>
            <span className="text-muted small">
              {new Date(recipe.created_at).toLocaleDateString("vi-VN")}
            </span>
          </div>

          {/* Ảnh hero (ảnh chính của món ăn) */}
          {recipe.main_image && (
            <img
              src={`http://localhost:8000/storage/${recipe.main_image}`}
              alt={recipe.title}
              className="img-fluid rounded shadow-sm mb-4"
            />
          )}

          {/* Mô tả món ăn */}
          <p className="lead text-muted fst-italic mb-4">{recipe.description}</p>

          {/* Thông tin stats */}
          <div className="recipe-stats mb-4 d-flex gap-4">
            <div><i className="fa-regular fa-clock"></i> {recipe.cooking_time} phút</div>
            <div><i className="fa-solid fa-user-group"></i> {recipe.servings} người ăn</div>
            <div><i className="fa-solid fa-fire text-danger"></i> {recipe.difficulty}</div>
          </div>

          {/* Nguyên liệu */}
          <div className="mb-5">
            <h4 className="fw-bold mb-3">Nguyên liệu</h4>
            <div className="ingredient-list">
              {recipe.ingredients?.map((ing, idx) => (
                <div className="form-check mb-2" key={idx}>
                  <input className="form-check-input" type="checkbox" id={`ing${idx}`} />
                  <label className="form-check-label fw-bold" htmlFor={`ing${idx}`}>
                    {ing.name} <span className="text-muted">{ing.quantity} {ing.unit}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Các bước nấu */}
          <div className="mb-5">
            <h4 className="fw-bold mb-4">Cách làm</h4>
            {recipe.steps?.map((step, idx) => (
              <div className="step-item mb-4 p-3 border rounded shadow-sm" key={idx}>
                <p className="fw-bold mb-2">Bước {idx + 1}</p>
                <p>{step.instruction}</p>
                {step.media_url && (
                  <img
                    src={`http://localhost:8000/storage/${step.media_url}`}
                    className="img-fluid rounded mt-2"
                    alt={`step-${idx + 1}`}
                  />
                )}
              </div>
            ))}
          </div>

          <hr className="my-5" />

          {/* Link báo cáo (chừa link rỗng để sau gộp code) */}
          <div className="d-flex justify-content-end mb-4">
            <a href="#" className="report-link" data-bs-toggle="modal" data-bs-target="#reportModal">
              <i className="fa-regular fa-flag me-1"></i> Báo cáo món ăn này
            </a>
          </div>
        </div>
        {/* ================== CỘT PHẢI: Sidebar tác giả ================== */}
        <div className="col-lg-4">
          <div className="sticky-sidebar">
            
            {/* Nút lưu + chia sẻ */}
            <div className="card shadow-sm p-3 mb-4">
              <div className="d-grid gap-2">
                {/* Nút Lưu món ăn (chừa API để sau gộp code) */}
                <button
                  className="btn btn-primary-cookpad btn-lg py-3 rounded-3"
                  onClick={() => {
                    // TODO: Gắn API lưu món ăn vào danh sách yêu thích
                    alert("Chức năng Lưu món ăn sẽ được gộp code sau!");
                  }}
                >
                  <i className="fa-regular fa-bookmark me-2"></i> <span>Lưu món ăn</span>
                </button>

                {/* Nút Chia sẻ (modal sẽ gộp code sau) */}
                <button
                  className="btn btn-outline-secondary py-2 rounded-3"
                  data-bs-toggle="modal"
                  data-bs-target="#shareModal"
                >
                  <i className="fa-solid fa-share-nodes me-2"></i> Chia sẻ
                </button>
              </div>
            </div>

            {/* Thông tin tác giả */}
            <div className="card shadow-sm p-3 text-center">
              <img
                src={recipe.user?.avatar || "https://via.placeholder.com/80"}
                className="rounded-circle mb-3"
                style={{ width: 80, height: 80, objectFit: "cover" }}
                alt="author"
              />
              <h5 className="fw-bold mb-1">{recipe.user?.name || "Ẩn danh"}</h5>
              <p className="text-muted small">@{recipe.user?.username || "user"} • {recipe.user?.recipes_count || 0} công thức</p>
              
              {/* ================== Nút Theo dõi (chừa API để sau gộp code) ================== */}
              <button
                className="btn btn-sm btn-outline-dark rounded-pill px-4"
                onClick={() => {
                  // TODO: Gắn API follow tác giả
                  alert("Chức năng Theo dõi sẽ được gộp code sau!");
                }}
              >
                Theo dõi
              </button>

              <hr />

              {/* ================== MÓN KHÁC CỦA BẾP ================== */}
              <h6 className="fw-bold small text-muted mb-3">MÓN KHÁC CỦA BẾP</h6>

              {/* Ví dụ hardcode, sau này sẽ fetch thêm từ API */}
              <div className="d-flex align-items-center mb-3 cursor-pointer">
                <img src="https://via.placeholder.com/50" className="rounded me-2" alt="other" />
                <div className="small fw-bold">Công thức khác</div>
              </div>

              <div className="d-flex align-items-center mb-3 cursor-pointer">
                <img src="https://via.placeholder.com/50" className="rounded me-2" alt="other" />
                <div className="small fw-bold">Công thức khác 2</div>
              </div>

              <div className="d-flex align-items-center mb-3 cursor-pointer">
                <img src="https://via.placeholder.com/50" className="rounded me-2" alt="other" />
                <div className="small fw-bold">Công thức khác 3</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
