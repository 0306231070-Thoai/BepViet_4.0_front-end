import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/Home/HomePage';
import Login from './pages/Auth/login';
import ForgotPassword from './pages/Auth/forgotPassword';
import Profile from './pages/User/Profile';

/**
 * Cấu trúc Route của dự án Bếp Việt 4.0
 * Sử dụng React Router v6 để quản lý các phân vùng chức năng
 */
function App() {
  return (
    <Routes>
      {/* Nhóm Route sử dụng Layout chung (Sidebar, Navbar, Footer)
        Phù hợp cho các tính năng: Khám phá, Trang cá nhân, Bảng tin [cite: 33, 37, 43]
      */}
      <Route path="/" element={<MainLayout />}>
        {/* Trang chủ - Nơi hiển thị Bảng tin cá nhân hóa [cite: 37] */}
        <Route index element={<HomePage />} />

        {/* Trang cá nhân - Thiết lập tài khoản và quản lý Cookbook [cite: 43] */}

        {/* Dự kiến các Route tiếp theo theo đồ án:
          - <Route path="discovery" element={<DiscoveryPage />} /> [cite: 33]
          - <Route path="create-recipe" element={<CreateRecipe />} /> [cite: 25]
        */}
      </Route>
      <Route path="profile" element={<Profile />} />

      {/* Nhóm Route độc lập (Không dùng chung Layout chính)
        Thường dùng cho các trang xác thực hoặc trang lỗi
      */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />

      {/* Trang lỗi 404 (Nếu cần)
        <Route path="*" element={<NotFound />} /> 
      */}
    </Routes>
  );
}

export default App;