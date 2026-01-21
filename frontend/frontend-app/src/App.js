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

        {/* Route Con: Trang chủ (Hiện ở vị trí Outlet của MainLayout) */}
        <Route path="/homepage" element={<HomePage />} />

        {/* Trang cá nhân - Thiết lập tài khoản và quản lý Cookbook [cite: 43] */}

        {/* Dự kiến các Route tiếp theo theo đồ án:
          - <Route path="discovery" element={<DiscoveryPage />} /> [cite: 33]
          - <Route path="create-recipe" element={<CreateRecipe />} /> [cite: 25]
        */}
      </Route>

      {/* Sau này làm trang Admin hoặc Login thì thêm Route ở ngoài này */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;