import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  // Giả lập trạng thái đăng nhập (Sau này lấy từ AuthContext)
  const isLoggedIn = true; 

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div id="sidebar-wrapper">
      <div className="sidebar-header">
        <div className="sidebar-brand text-danger fw-bold fs-4 p-0">
          <Link to="/">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Cookpad_logo.svg/1200px-Cookpad_logo.svg.png"
              alt="Logo"
              className="logo-img"
            />
          </Link>
        </div>
        <button id="menu-toggle">
          <i className="fa-solid fa-bars"></i>
        </button>
      </div>

      <div className="list-group list-group-flush mt-3">
        <Link to="/" className={`list-group-item list-group-item-action ${isActive('/')}`}>
          <i className="fa-solid fa-magnifying-glass"></i> <span>Tìm kiếm</span>
        </Link>
        
        <Link to="/regions" className={`list-group-item list-group-item-action ${isActive('/regions')}`}>
          <i className="fa-solid fa-earth-asia"></i> <span>Vùng miền</span>
        </Link>

        {isLoggedIn && (
          <>
            <Link to="/blog" className="list-group-item list-group-item-action">
              <i className="fa-solid fa-pen-nib"></i> <span>Blog</span>
            </Link>
            <Link to="/qa" className="list-group-item list-group-item-action">
              <i className="fa-solid fa-comments"></i> <span>Hỏi&Đáp</span>
            </Link>
            <Link to="/following" className="list-group-item list-group-item-action">
              <i className="fa-solid fa-user-group"></i> <span>Đang theo dõi</span>
            </Link>
            <Link to="/cookbook" className="list-group-item list-group-item-action">
              <i className="fa-solid fa-book-open"></i> <span>Kho Món Ngon</span>
            </Link>
          </>
        )}

        {!isLoggedIn && (
          <div className="p-4 mt-auto text-muted small sidebar-footer-text">
            <p>Đăng nhập để lưu món ngon và chia sẻ công thức của bạn.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;