import React, { useEffect, useState } from 'react';
// Không cần import axios nữa

const HomePage = () => {
  const [homeData, setHomeData] = useState({
    featured_recipes: [],
    new_recipes: []
  });
  const [loading, setLoading] = useState(true);

  // Gọi API bằng fetch
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // 1. Gọi đến API
        const response = await fetch('http://localhost:8000/api/home');

        // 2. Kiểm tra nếu có lỗi mạng hoặc lỗi 404/500
        if (!response.ok) {
          throw new Error(`Lỗi HTTP: ${response.status}`);
        }

        // 3. Chuyển đổi dữ liệu nhận được sang JSON (Axios tự làm bước này, nhưng fetch thì phải tự làm)
        const jsonData = await response.json();

        // 4. Lưu vào state (kiểm tra cấu trúc đúng như Controller trả về)
        if (jsonData.status === 'success') {
          setHomeData(jsonData.data);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Hàm xử lý ảnh (Giữ nguyên)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/400x300?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000/storage/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container">
        {/* Search Section */}

        <div className="search-container text-center py-4">
<<<<<<< HEAD
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Cookpad_logo.svg/1200px-Cookpad_logo.svg.png"
            alt="Cookpad"
            className="cookpad-logo-main"
            style={{ maxWidth: '200px' }}
          />
          <div className="search-box mt-3 mx-auto" style={{ maxWidth: '600px' }}>
=======
          <img src={logo} alt="Bếp Việt Logo"
            style={{
              width: '75px',   // Chỉnh số này to nhỏ tùy ý
              height: 'auto',   // Giữ nguyên tỷ lệ ảnh, không bị lùn hay dẹt
              objectFit: 'contain' // Đảm bảo ảnh nằm gọn trong khung
            }}
            className="logo-img" />
          <div className="search-box mt-3 " style={{ maxWidth: '600px' }}>
>>>>>>> f5a5de9e873c5d10b26996cdb09996f76e06bd1d
            <div className="input-group">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Tìm tên món hay nguyên liệu..."
<<<<<<< HEAD
                />
                <button className="btn btn-warning text-white fw-bold">Tìm Kiếm</button>
=======
              />
              <button className="btn btn-warning text-white fw-bold " style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}>Tìm Kiếm</button>
>>>>>>> f5a5de9e873c5d10b26996cdb09996f76e06bd1d
            </div>
          </div>
        </div>

        {/* Trending Section */}
        <h5 className="mb-3 text-secondary fw-bold mt-4">
          Gợi Ý Hôm Nay
          <small className="float-end text-muted fw-normal" style={{ fontSize: '0.8rem' }}>
            Cập nhật mới nhất
          </small>
        </h5>

        <div className="row g-3">
          {homeData.featured_recipes && homeData.featured_recipes.length > 0 ? (
            homeData.featured_recipes.map((recipe) => (
              <div className="col-6 col-md-3" key={recipe.id}>
                <div className="trend-card position-relative rounded overflow-hidden shadow-sm">
                  <img
                    src={getImageUrl(recipe.main_image)}
                    alt={recipe.title}
                    className="w-100 object-fit-cover"
                    style={{ height: '200px' }}
                  />
                  <div className="trend-card-overlay position-absolute bottom-0 start-0 w-100 p-2 bg-dark bg-opacity-50 text-white">
                    <p className="trend-text fw-bold mb-0 text-truncate">{recipe.title}</p>
                    <small style={{ fontSize: '0.7rem' }}>
                      <i className="fa-regular fa-clock me-1"></i>{recipe.cooking_time || 0}p
                    </small>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">Không có dữ liệu món ăn.</p>
          )}
        </div>
      </div>

      {/* AI Modal - Đặt ở đây hoặc tách component riêng */}
      <div className="modal fade" id="aiModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-light border-0">
              <h5 className="modal-title fw-bold text-primary">
                <i className="fa-solid fa-robot me-2"></i>Trợ lý Bếp A.I
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body p-4">
              <div className="row">
                <div className="col-md-6 border-end">
                  <label className="form-label fw-bold">Trong tủ lạnh bạn có gì?</label>
                  <textarea
                    className="form-control mb-3"
                    rows="4"
                    placeholder="Ví dụ: 2 quả trứng, 1 mớ rau muống, thịt bò thừa..."
                  ></textarea>

                  <label className="form-label fw-bold">Bạn muốn ăn kiểu gì?</label>
                  <select className="form-select mb-4">
                    <option defaultValue>Tất cả</option>
                    <option>Món nhanh (dưới 15p)</option>
                    <option>Eat Clean / Healthy</option>
                    <option>Món nhậu</option>
                  </select>

                  <button className="btn btn-ai-magic w-100 py-2 rounded-3 justify-content-center">
                    <i className="fa-solid fa-wand-magic-sparkles"></i> Phân tích & Gợi ý ngay
                  </button>
                </div>
                <div className="col-md-6 ps-md-4 mt-4 mt-md-0 text-center">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4712/4712009.png"
                    width="100"
                    className="mb-3 opacity-50"
                    alt="AI Waiting"
                  />
                  <h6 className="text-muted">A.I đang chờ nguyên liệu từ bạn...</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;

