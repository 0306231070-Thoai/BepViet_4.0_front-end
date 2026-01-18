import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Nhận prop onToggle được truyền từ MainLayout
const Sidebar = ({ onToggle }) => { 
  const location = useLocation();
  
  // Lấy trạng thái đăng nhập thật từ Context (không dùng biến giả lập nữa)
  const { isLoggedIn } = useAuth(); 

  // Hàm kiểm tra link nào đang active để tô màu
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
        
        {/* --- QUAN TRỌNG: Gắn sự kiện onClick={onToggle} vào đây --- */}
        <button id="menu-toggle" onClick={onToggle}>
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

        {/* Chỉ hiện các mục này khi ĐÃ ĐĂNG NHẬP */}
        {isLoggedIn && (
          <>
            <Link to="/blog" className={`list-group-item list-group-item-action ${isActive('/blog')}`}>
              <i className="fa-solid fa-pen-nib"></i> <span>Blog</span>
            </Link>
            <Link to="/qa" className={`list-group-item list-group-item-action ${isActive('/qa')}`}>
              <i className="fa-solid fa-comments"></i> <span>Hỏi&Đáp</span>
            </Link>
            <Link to="/following" className={`list-group-item list-group-item-action ${isActive('/following')}`}>
              <i className="fa-solid fa-user-group"></i> <span>Đang theo dõi</span>
            </Link>
            <Link to="/cookbook" className={`list-group-item list-group-item-action ${isActive('/cookbook')}`}>
              <i className="fa-solid fa-book-open"></i> <span>Kho Món Ngon</span>
            </Link>
          </>
        )}

        {/* Chỉ hiện thông báo này khi CHƯA ĐĂNG NHẬP */}
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