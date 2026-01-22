import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = "YiTJ3oZgIt";

  // State form cơ bản
  const [form, setForm] = useState({
    category_id: "",
    title: "",
    description: "",
    cooking_time: "",
    difficulty: "Easy",
    servings: "",
  });

  // Danh mục
  const [categories, setCategories] = useState([]);

  // Steps + Ingredients + Image
  const [steps, setSteps] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [mainImage, setMainImage] = useState(null); // ảnh mới
  const [oldMainImage, setOldMainImage] = useState(null); // ảnh cũ

  // State lỗi
  const [errors, setErrors] = useState({});

  // Fetch categories
  useEffect(() => {
    fetch("http://localhost:8000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch recipe để prefill form
  useEffect(() => {
    fetch(`http://localhost:8000/api/recipes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const recipe = data.data || data;
        setForm({
          category_id: recipe.category_id,
          title: recipe.title,
          description: recipe.description || "",
          cooking_time: recipe.cooking_time || "",
          difficulty: recipe.difficulty,
          servings: recipe.servings || "",
        });
        setIngredients(
          recipe.ingredients?.map((ing) => ({
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
          })) || [{ name: "", quantity: "", unit: "" }]
        );
        setSteps(
          recipe.steps?.map((s, i) => ({
            step_order: i + 1,
            instruction: s.instruction,
            media_url: null,
            old_media_url: s.media_url,
          })) || [{ step_order: 1, instruction: "", media_url: null }]
        );
        setOldMainImage(recipe.main_image);
      })
      .catch((err) => console.error(err));
  }, [id, token]);
  // handle ảnh chính
  const handleMainImageChange = (e) => setMainImage(e.target.files[0]);

  // handle ảnh từng step
  const handleStepImageChange = (e, index) => {
    const newSteps = [...steps];
    newSteps[index].media_url = e.target.files[0];
    setSteps(newSteps);
  };

  // re-index step_order
  const reIndexSteps = (list) => list.map((s, i) => ({ ...s, step_order: i + 1 }));

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData();
    formData.append("category_id", form.category_id);
    formData.append("title", form.title);
    if (form.description) formData.append("description", form.description);
    if (form.cooking_time) formData.append("cooking_time", form.cooking_time);
    formData.append("difficulty", form.difficulty);
    if (form.servings) formData.append("servings", form.servings);
    if (mainImage) formData.append("main_image", mainImage);

    steps.forEach((step, index) => {
      formData.append(`steps[${index}][step_order]`, step.step_order);
      formData.append(`steps[${index}][instruction]`, step.instruction);
      if (step.media_url) {
        formData.append(`steps[${index}][media_url]`, step.media_url);
      }
    });

    ingredients.forEach((ing, index) => {
      if (ing.name && ing.quantity && ing.unit) {
        formData.append(`ingredients[${index}][name]`, ing.name);
        formData.append(`ingredients[${index}][quantity]`, ing.quantity);
        formData.append(`ingredients[${index}][unit]`, ing.unit);
      }
    });

    try {
      const res = await fetch(`http://localhost:8000/api/recipes/${id}`, {
        method: "PUT", // hoặc PUT/PATCH tùy route
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        alert("Cập nhật công thức thành công, chờ duyệt!");
        navigate("/my-recipes");
      } else {
        const data = await res.json();
        setErrors(data.errors || {});
        alert("Có lỗi, vui lòng kiểm tra lại form.");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối API");
    }
  };
  return (
    <div className="container py-4" style={{ maxWidth: "800px" }}>
      <h2 className="fw-bold mb-4">
        <i className="fa-solid fa-pen text-danger me-2"></i> Chỉnh sửa công thức
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Ảnh bìa */}
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-body">
            <label className="form-label fw-bold">
              <i className="fa-regular fa-image text-success me-2"></i> Ảnh bìa món ăn
            </label>
            {oldMainImage && !mainImage && (
              <img
                src={`http://localhost:8000/storage/${oldMainImage}`}
                alt="old"
                className="img-fluid rounded mb-2"
              />
            )}
            <input type="file" className="form-control" onChange={handleMainImageChange} />
            {errors.main_image && <small className="text-danger">{errors.main_image[0]}</small>}
          </div>
        </div>
        {/* Thông tin cơ bản */}
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-body">
            <h5 className="fw-bold mb-3">
              <i className="fa-solid fa-circle-info text-info me-2"></i> Thông tin cơ bản
            </h5>

            {/* Danh mục */}
            <div className="mb-3">
              <label className="form-label fw-bold">
                <i className="fa-solid fa-list text-primary me-2"></i> Danh mục
              </label>
              <select
                className="form-select"
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category_id && <small className="text-danger">{errors.category_id[0]}</small>}
            </div>

            {/* Tên món ăn */}
            <div className="mb-3">
              <label className="form-label fw-bold">
                <i className="fa-solid fa-bowl-food text-success me-2"></i> Tên món ăn
              </label>
              <input
                className="form-control form-control-lg"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              {errors.title && <small className="text-danger">{errors.title[0]}</small>}
            </div>

            {/* Mô tả ngắn */}
            <div className="mb-3">
              <label className="form-label fw-bold">
                <i className="fa-solid fa-align-left text-secondary me-2"></i> Mô tả ngắn
              </label>
              <textarea
                className="form-control"
                rows="3"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              {errors.description && <small className="text-danger">{errors.description[0]}</small>}
            </div>
            {/* Khẩu phần + Thời gian + Độ khó */}
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">
                  <i className="fa-solid fa-users text-info me-2"></i> Khẩu phần
                </label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={form.servings}
                  onChange={(e) => setForm({ ...form, servings: e.target.value })}
                />
                {errors.servings && <small className="text-danger">{errors.servings[0]}</small>}
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">
                  <i className="fa-solid fa-clock text-warning me-2"></i> Thời gian nấu (phút)
                </label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={form.cooking_time}
                  onChange={(e) => setForm({ ...form, cooking_time: e.target.value })}
                />
                {errors.cooking_time && <small className="text-danger">{errors.cooking_time[0]}</small>}
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">
                  <i className="fa-solid fa-signal text-danger me-2"></i> Độ khó
                </label>
                <select
                  className="form-select"
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
                {errors.difficulty && <small className="text-danger">{errors.difficulty[0]}</small>}
              </div>
            </div>
          </div>
        </div>
        {/* Nguyên liệu */}
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-header bg-white fw-bold">
            <i className="fa-solid fa-carrot text-warning me-2"></i> Nguyên liệu
          </div>
          <div className="card-body">
            {ingredients.map((ing, index) => (
              <div key={index} className="row g-3 mb-3 align-items-end">
                <div className="col-md-4">
                  <label className="form-label fw-bold">
                    <i className="fa-solid fa-leaf text-success me-2"></i> Tên nguyên liệu
                  </label>
                  <input
                    className="form-control"
                    value={ing.name}
                    onChange={(e) => {
                      const list = [...ingredients];
                      list[index].name = e.target.value;
                      setIngredients(list);
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold">
                    <i className="fa-solid fa-hashtag text-primary me-2"></i> Số lượng
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    className="form-control"
                    value={ing.quantity}
                    onChange={(e) => {
                      const list = [...ingredients];
                      list[index].quantity = e.target.value;
                      setIngredients(list);
                    }}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">
                    <i className="fa-solid fa-ruler text-secondary me-2"></i> Đơn vị
                  </label>
                  <input
                    className="form-control"
                    value={ing.unit}
                    onChange={(e) => {
                      const list = [...ingredients];
                      list[index].unit = e.target.value;
                      setIngredients(list);
                    }}
                  />
                </div>
                <div className="col-auto d-flex align-items-end">
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-light text-danger"
                      onClick={() => setIngredients(ingredients.filter((_, i) => i !== index))}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-primary w-100 mt-2"
              onClick={() => setIngredients([...ingredients, { name: "", quantity: "", unit: "" }])}
            >
              <i className="fa-solid fa-plus"></i> Thêm nguyên liệu
            </button>
          </div>
        </div>

        {/* Các bước nấu */}
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-header bg-white fw-bold">
            <i className="fa-solid fa-list-ol text-danger me-2"></i> Cách làm
          </div>
          <div className="card-body">
            {steps.map((step, index) => (
              <div key={index} className="step-card mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-primary">Bước {index + 1}</span>
                  {steps.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-light text-danger"
                      onClick={() => setSteps(reIndexSteps(steps.filter((_, i) => i !== index)))}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  )}
                </div>

                <label className="form-label fw-bold">
                  <i className="fa-solid fa-align-left text-secondary me-2"></i> Mô tả bước
                </label>
                <textarea
                  className="form-control mb-2"
                  rows="2"
                  value={step.instruction}
                  onChange={(e) => {
                    const list = [...steps];
                    list[index].instruction = e.target.value;
                    setSteps(list);
                  }}
                  required
                />

                {/* Ảnh minh họa */}
                <label className="form-label fw-bold mt-2">
                  <i className="fa-regular fa-image text-success me-2"></i> Ảnh minh họa
                </label>
                {step.old_media_url && !step.media_url && (
                  <img
                    src={`http://localhost:8000/storage/${step.old_media_url}`}
                    alt="old-step"
                    className="img-fluid rounded mt-2"
                  />
                )}
                <input
                  type="file"
                  className="form-control form-control-sm mt-2"
                  onChange={(e) => handleStepImageChange(e, index)}
                />
              </div>
            ))}

            <button
              type="button"
              className="btn btn-outline-primary w-100"
              onClick={() =>
                setSteps(
                  reIndexSteps([
                    ...steps,
                    { step_order: steps.length + 1, instruction: "", media_url: null },
                  ])
                )
              }
            >
              <i className="fa-solid fa-plus"></i> Thêm bước
            </button>
          </div>
        </div>
        {/* Nút submit */}
        <div className="d-grid">
          <button type="submit" className="btn btn-warning text-white fw-bold py-3">
            <i className="fa-solid fa-paper-plane me-2"></i> CẬP NHẬT CÔNG THỨC
          </button>
          {errors.submit && <small className="text-danger mt-2">{errors.submit[0]}</small>}
        </div>
      </form>
    </div>
  );
}

export default EditRecipe;
