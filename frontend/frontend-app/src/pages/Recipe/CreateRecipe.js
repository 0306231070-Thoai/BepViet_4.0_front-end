import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateRecipe() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // lấy token từ localStorage

  // State form cơ bản
  const [form, setForm] = useState({
    category_id: '',
    title: '',
    description: '',
    cooking_time: '',
    difficulty: 'Easy',
    servings: '',
  });

  // Danh mục từ API
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch('http://localhost:8000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);

  // Steps + Ingredients + Image
  const [steps, setSteps] = useState([{ step_order: 1, instruction: '', media_url: null }]);
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
  const [mainImage, setMainImage] = useState(null);

  // State lỗi
  const [errors, setErrors] = useState({});

  // handle ảnh chính
  const handleMainImageChange = (e) => setMainImage(e.target.files[0]);

  // handle ảnh từng step
  const handleStepImageChange = (e, index) => {
    const newSteps = [...steps];
    newSteps[index].media_url = e.target.files[0];
    setSteps(newSteps);
  };

  // check trùng step_order
  const validateStepOrder = () => {
    const orders = steps.map(step => step.step_order);
    const duplicates = orders.filter((item, index) => orders.indexOf(item) !== index);
    return duplicates.length === 0;
  };

  // re-index step_order sau khi thêm/xóa
  const reIndexSteps = (list) => list.map((s, i) => ({ ...s, step_order: i + 1 }));
  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // clear lỗi cũ

    if (!validateStepOrder()) {
      alert('Thứ tự các bước nấu bị trùng. Vui lòng kiểm tra lại.');
      return;
    }

    const formData = new FormData();
    formData.append('category_id', form.category_id);
    formData.append('title', form.title);
    if (form.description) formData.append('description', form.description);
    if (form.cooking_time) formData.append('cooking_time', form.cooking_time);
    formData.append('difficulty', form.difficulty);
    if (form.servings) formData.append('servings', form.servings);
    if (mainImage) formData.append('main_image', mainImage);

    // append steps (chỉ append nếu có instruction)
    steps.forEach((step, index) => {
      formData.append(`steps[${index}][step_order]`, step.step_order);
      if (step.instruction) formData.append(`steps[${index}][instruction]`, step.instruction);
      if (step.media_url) formData.append(`steps[${index}][media_url]`, step.media_url);
    });

    // append ingredients (chỉ append nếu có đủ 3 field)
    ingredients.forEach((ing, index) => {
      if (ing.name && ing.quantity && ing.unit) {
        formData.append(`ingredients[${index}][name]`, ing.name);
        formData.append(`ingredients[${index}][quantity]`, ing.quantity);
        formData.append(`ingredients[${index}][unit]`, ing.unit);
      }
    });

    try {
      const res = await fetch('http://localhost:8000/api/recipes', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        alert('Đăng công thức thành công, chờ duyệt!');
        // reset form
        setForm({ category_id: '', title: '', description: '', cooking_time: '', difficulty: 'Easy', servings: '' });
        setSteps([{ step_order: 1, instruction: '', media_url: null }]);
        setIngredients([{ name: '', quantity: '', unit: '' }]);
        setMainImage(null);
        navigate('/my-recipes');
      } else {
        const data = await res.json();
        setErrors(data.errors || {});
        alert('Có lỗi, vui lòng kiểm tra lại form.');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối API');
    }
  };
return (
  <div className="container py-4" style={{ maxWidth: "800px" }}>
    {/* Tiêu đề chính */}
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2 className="fw-bold">
        <i className="fa-solid fa-utensils text-danger me-2"></i> Chia sẻ công thức mới
      </h2>
      <button type="button" className="btn btn-outline-secondary">
        <i className="fa-regular fa-file text-primary me-1"></i> Lưu nháp
      </button>
    </div>

    <form onSubmit={handleSubmit}>
      {/* Ảnh bìa */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-body">
          <label className="form-label fw-bold">
            <i className="fa-regular fa-image text-success me-2"></i> Ảnh bìa món ăn
          </label>
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
            <select className="form-select" value={form.category_id}
              onChange={e => setForm({ ...form, category_id: e.target.value })} required>
              <option value="">-- Chọn danh mục --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.category_id && <small className="text-danger">{errors.category_id[0]}</small>}
          </div>

          {/* Tên món ăn */}
          <div className="mb-3">
            <label className="form-label fw-bold">
              <i className="fa-solid fa-bowl-food text-success me-2"></i> Tên món ăn
            </label>
            <input className="form-control form-control-lg"
              placeholder="Tên món ăn (vd: Canh rau muống)"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required />
            {errors.title && <small className="text-danger">{errors.title[0]}</small>}
          </div>

          {/* Mô tả ngắn */}
          <div className="mb-3">
            <label className="form-label fw-bold">
              <i className="fa-solid fa-align-left text-secondary me-2"></i> Mô tả ngắn
            </label>
            <textarea className="form-control" rows="3"
              placeholder="Mô tả ngắn về món ăn..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
            {errors.description && <small className="text-danger">{errors.description[0]}</small>}
          </div>

          {/* Khẩu phần + Thời gian + Độ khó */}
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">
                <i className="fa-solid fa-users text-info me-2"></i> Khẩu phần
              </label>
              <input type="number" min="1" step="1"
                className="form-control"
                placeholder="Số khẩu phần (vd: 4)"
                value={form.servings}
                onChange={e => setForm({ ...form, servings: e.target.value })} />
              {errors.servings && <small className="text-danger">{errors.servings[0]}</small>}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">
                <i className="fa-solid fa-clock text-warning me-2"></i> Thời gian nấu (phút)
              </label>
              <input type="number" min="1" step="1"
                className="form-control"
                placeholder="Thời gian nấu (vd: 30)"
                value={form.cooking_time}
                onChange={e => setForm({ ...form, cooking_time: e.target.value })} />
              {errors.cooking_time && <small className="text-danger">{errors.cooking_time[0]}</small>}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">
                <i className="fa-solid fa-signal text-danger me-2"></i> Độ khó
              </label>
              <select className="form-select" value={form.difficulty}
                onChange={e => setForm({ ...form, difficulty: e.target.value })}>
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
              {/* Tên nguyên liệu */}
              <div className="col-md-4">
                <label className="form-label fw-bold">
                  <i className="fa-solid fa-leaf text-success me-2"></i> Tên nguyên liệu
                </label>
                <input
                  className="form-control"
                  placeholder="VD: Rau muống"
                  value={ing.name}
                  onChange={e => {
                    const list = [...ingredients];
                    list[index].name = e.target.value;
                    setIngredients(list);
                  }}
                />
                {errors[`ingredients.${index}.name`] && (
                  <small className="text-danger">{errors[`ingredients.${index}.name`][0]}</small>
                )}
              </div>

              {/* Số lượng */}
              <div className="col-md-3">
                <label className="form-label fw-bold">
                  <i className="fa-solid fa-hashtag text-primary me-2"></i> Số lượng
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  className="form-control"
                  placeholder="VD: 200"
                  value={ing.quantity}
                  onChange={e => {
                    const list = [...ingredients];
                    list[index].quantity = e.target.value;
                    setIngredients(list);
                  }}
                />
                {errors[`ingredients.${index}.quantity`] && (
                  <small className="text-danger">{errors[`ingredients.${index}.quantity`][0]}</small>
                )}
              </div>

              {/* Đơn vị */}
              <div className="col-md-4">
                <label className="form-label fw-bold">
                  <i className="fa-solid fa-ruler text-secondary me-2"></i> Đơn vị
                </label>
                <input
                  className="form-control"
                  placeholder="VD: gram, ml, muỗng"
                  value={ing.unit}
                  onChange={e => {
                    const list = [...ingredients];
                    list[index].unit = e.target.value;
                    setIngredients(list);
                  }}
                />
                {errors[`ingredients.${index}.unit`] && (
                  <small className="text-danger">{errors[`ingredients.${index}.unit`][0]}</small>
                )}
              </div>

              {/* Nút xoá */}
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



              {/* Nút thêm dòng */}
          <button
            type="button"
            className="btn btn-outline-primary w-100 mt-2"
            onClick={() => setIngredients([...ingredients, { name: '', quantity: '', unit: '' }])}
          >
            <i className="fa-solid fa-plus"></i> Thêm dòng
          </button>
        </div>
      </div>

      {/* Cách làm */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-header bg-white fw-bold">
          <i className="fa-solid fa-list-ol text-danger me-2"></i> Cách làm
        </div>
        <div className="card-body">
          {steps.map((step, index) => (
            <div key={index} className="step-card mb-3">
              {/* Badge + nút xoá */}
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

              {/* Mô tả bước */}
              <label className="form-label fw-bold">
                <i className="fa-solid fa-align-left text-secondary me-2"></i> Mô tả bước
              </label>
              <textarea
                className="form-control mb-2"
                rows="2"
                placeholder="Mô tả chi tiết bước này..."
                value={step.instruction}
                onChange={e => {
                  const list = [...steps];
                  list[index].instruction = e.target.value;
                  setSteps(list);
                }}
                required
              />
              {errors[`steps.${index}.instruction`] && (
                <small className="text-danger">
                  {errors[`steps.${index}.instruction`][0]}
                </small>
              )}

              {/* Ảnh minh họa */}
              <label className="form-label fw-bold mt-2">
                <i className="fa-regular fa-image text-success me-2"></i> Ảnh minh họa
              </label>
              <input
                type="file"
                className="form-control form-control-sm"
                onChange={e => handleStepImageChange(e, index)}
              />
              {errors[`steps.${index}.media_url`] && (
                <small className="text-danger">
                  {errors[`steps.${index}.media_url`][0]}
                </small>
              )}
            </div>
          ))}

          {/* Nút thêm bước */}
          <button
            type="button"
            className="btn btn-outline-primary w-100"
            onClick={() =>
              setSteps(reIndexSteps([
                ...steps,
                { step_order: steps.length + 1, instruction: '', media_url: null }
              ]))
            }
          >
            <i className="fa-solid fa-plus"></i> Thêm bước
          </button>
        </div>
      </div>

      {/* Nút submit */}
      <div className="d-grid">
        <button type="submit" className="btn btn-warning text-white fw-bold py-3">
          <i className="fa-solid fa-paper-plane me-2"></i> ĐĂNG CÔNG THỨC
        </button>
        {errors.submit && (
          <small className="text-danger mt-2">{errors.submit[0]}</small>
        )}
      </div>
    </form>
  </div>
);
}

export default CreateRecipe;

