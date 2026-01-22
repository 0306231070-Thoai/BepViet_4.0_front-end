import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/Home/HomePage';
import Login from './pages/Auth/login';
import ForgotPassword from './pages/Auth/forgotPassword';
import Profile from './pages/User/Profile';
import CookbookList from './pages/User/Cookbook';
import CookbookDetail from './pages/User/CookbookDetail'; // Import trang chi tiết mới

function App() {
  return (
    <Routes>
      {/* Nhóm Route sử dụng Layout chung */}
      <Route path="/" element={<MainLayout />}>
        <Route path="/homepage" element={<HomePage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />

      {/* User Routes */}
      <Route path="/profile" element={<Profile />} />

      {/* Quản lý Cookbook */}
      <Route path="/cookbooks" element={<CookbookList />} />

      {/* Route chi tiết: ":id" là tham số động để lấy ID từ URL */}
      <Route path="/cookbooks/:id" element={<CookbookDetail />} />

    </Routes>
  );
}

export default App;