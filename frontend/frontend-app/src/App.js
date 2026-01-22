import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/Auth/login';
import HomeWrapper from './pages/Home/HomeWrapper'; // Bộ điều hướng Trang chủ
import Profile from './pages/User/Profile';
import QAPage from './pages/QAPage';
// Recipe Pages

import RecipeDetail from './pages/Recipe/RecipeDetail';   // chi tiết công thức
import CreateRecipe from './pages/Recipe/CreateRecipe';   // trang tạo công thức mới
import EditRecipe from './pages/Recipe/EditRecipe';       // trang chỉnh sửa công thức
import MyRecipes from './pages/Recipe/MyRecipes';         // bếp của tôi (quản lý công thức cá nhân)
// Category & Region Pages
import CategoryList from './pages/Category/CategoryList';
import CategoryDetail from './pages/Category/CategoryDetail';
import RegionPage from './pages/Category/RegionPage';

//admin
import AdminLayout from "./components/Admin/AdminLayout";

import Dashboard from "./pages/Admin/Dashboard";
import Users from "./pages/Admin/Users";

import Reports from "./pages/Admin/Reports";
import AdminPosts from "./pages/Admin/AdminPosts";
import AdminRecipes from "./pages/Admin/AdminRecipes";
import Categories from "./pages/Admin/Categories";
import Settings from "./pages/Admin/Settings";

function App() {
  return (
    <Routes>
      {/* --- NHÓM 1: CÁC TRANG KHÔNG CÓ SIDEBAR/NAVBAR --- */}
      <Route path="/login" element={<Login />} />
      {/* Thêm route Register, ForgotPassword... ở đây nếu có */}


      {/* --- NHÓM 2: CÁC TRANG DÙNG MAIN LAYOUT (CÓ SIDEBAR + NAVBAR) --- */}
      {/* MainLayout làm Route cha, các trang khác là Route con */}
      <Route path="/" element={<MainLayout />}>
        <Route path="/QAPage" element={<QAPage />} />
        {/* Route index: Khi vào đường dẫn "/" thì chạy HomeWrapper */}
        <Route index element={<HomeWrapper />} />

        {/* User */}
        <Route path="profile" element={<Profile />} />

        {/* Recipe */}
         {/* Công thức */}
             
               <Route path="recipes/:id" element={<RecipeDetail />} />    {/* Chi tiết công thức */}
               <Route path="recipes/create" element={<CreateRecipe />} /> {/* Trang tạo công thức mới */}
               <Route path="recipes/:id/edit" element={<EditRecipe />} /> {/* Trang chỉnh sửa công thức */}
               <Route path="my-recipes" element={<MyRecipes />} />        {/* Bếp của tôi */}
       

        {/* Category & Regions */}
        <Route path="regions" element={<RegionPage />} />
        <Route path="categories" element={<CategoryList />} />
        <Route path="categories/:id" element={<CategoryDetail />} />

      </Route>
    
    {/* Admin layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} /> 
        {/* /admin */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="posts" element={<AdminPosts />} />
        <Route path="categories" element={<Categories />} />
        <Route path="recipes" element={<AdminRecipes />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;