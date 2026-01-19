import React from 'react';

const HomePage = () => {
  // Dữ liệu giả để map (thay vì code cứng nhiều div)
  const trends = [
    { title: "Món ngon từ heo", img: "https://images.unsplash.com/photo-1606509036365-5555c478bc0f?w=400&q=80" },
    { title: "Bánh ngọt đơn giản", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80" },
    { title: "Thịt ba chỉ", img: "https://images.unsplash.com/photo-1544025162-d76690b67f61?w=400&q=80" },
    { title: "Cá hồi", img: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400&q=80" },
    { title: "Món khoai tây", img: "https://images.unsplash.com/photo-1518977676605-dc56455512a5?w=400&q=80" },
    { title: "Gỏi / Nộm", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80" },
    { title: "Sườn xào", img: "https://images.unsplash.com/photo-1544511916-0148ccdeb877?w=400&q=80" },
    { title: "Món tôm", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
  ];

  return (
    <>
      <div className="container">
        {/* Search Section */}
        <div className="search-container">
          <img
            src="/img/logo.png"
            alt="Cookpad"
            className="img-fluid"
            style={{ maxHeight: '80px', objectFit: 'contain' }}
          />
          <div className="search-box mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Tìm tên món hay nguyên liệu..."
            />
            <button className="btn-search">Tìm Kiếm</button>
          </div>
        </div>

        {/* Trending Section */}
        <h5 className="mb-3 text-secondary fw-bold">
          Từ Khóa Thịnh Hành
          <small className="float-end text-muted fw-normal" style={{ fontSize: '0.8rem' }}>
            Cập nhật hôm nay
          </small>
        </h5>

        <div className="row g-3">
          {trends.map((item, index) => (
            <div className="col-6 col-md-3" key={index}>
              <div className="trend-card">
                <img src={item.img} alt={item.title} />
                <div className="trend-card-overlay">
                  <p className="trend-text">{item.title}</p>
                </div>
              </div>
            </div>
          ))}
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