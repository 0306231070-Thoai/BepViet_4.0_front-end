import { Link } from 'react-router-dom';

const Navbar = () => {
  // Giả lập trạng thái đăng nhập
  const isLoggedIn = true; 

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-transparent border-bottom-0 mb-3">
      <div className="container-fluid ps-0">
        <button
          className="btn btn-outline-secondary border-0 d-md-none me-2"
          id="mobile-menu-toggle"
        >
          <i className="fa-solid fa-bars fs-5"></i>
        </button>

        <div className="ms-auto d-flex align-items-center gap-3">
          {/* GUEST: Chưa đăng nhập */}
          {!isLoggedIn && (
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-outline-secondary">
                Đăng nhập
              </Link>
              <Link to="/register" className="btn btn-primary-cookpad">
                Đăng ký
              </Link>
            </div>
          )}

          {/* USER: Đã đăng nhập */}
          {isLoggedIn && (
            <div className="d-flex align-items-center gap-3">
              <button
                className="btn btn-ai-magic rounded-pill px-3"
                data-bs-toggle="modal"
                data-bs-target="#aiModal"
              >
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                <span className="d-none d-md-inline"> A.I Gợi ý</span>
              </button>

              <div className="dropdown">
                <div
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80"
                    alt="Avatar"
                    className="user-avatar"
                  />
                </div>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                  <li className="px-3 py-2 border-bottom mb-2">
                    <div className="fw-bold text-dark">Thoại Developer</div>
                    <small className="text-muted">thoai@example.com</small>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/cookbook">
                      <i className="fa-solid fa-book-bookmark me-2"></i> Quản lý Cookbook
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/my-recipes">
                      <i className="fa-solid fa-utensils me-2"></i> Quản lý Công thức
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="fa-regular fa-id-card me-2"></i> Hồ sơ của tôi
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger">
                      <i className="fa-solid fa-right-from-bracket me-2"></i> Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>

              <Link to="/create-recipe" className="btn btn-primary-cookpad">
                <i className="fa-solid fa-plus"></i>
                <span className="d-none d-md-inline"> Viết món</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;