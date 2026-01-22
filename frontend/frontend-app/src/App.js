import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/Home/HomePage';
import Login from './pages/Auth/login';
import ForgotPassword from './pages/Auth/forgotPassword';
import Profile from './pages/User/Profile';
import BlogFeed from "./pages/Blog/BlogFeed";
import BlogDetail from "./pages/Blog/BlogDetail";
import WriteBlog from "./pages/Blog/WriteBlog";
import Following from "./pages/Following/Following";

function App() {
  return (
    <Routes>
      {/* Route Cha: MainLayout (Có Sidebar + Navbar + Footer) */}
      <Route path="/" element={<MainLayout />}>

        {/* Route Con: Trang chủ (Hiện ở vị trí Outlet của MainLayout) */}
        <Route path="/homepage" element={<HomePage />} />
        

        {/* Ví dụ sau này thêm trang chi tiết món ăn */}
        {/* <Route path="recipes/:id" element={<RecipeDetail />} /> */}
        <Route path="/blog-feed" element={<BlogFeed />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/blogs/write-blog" element={<WriteBlog />} />
        <Route path="/following" element={<Following />} />
        <Route path="/following/:id" element={<Following />} />

      </Route>

      {/* Sau này làm trang Admin hoặc Login thì thêm Route ở ngoài này */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/profile" element={<Profile />} />

    </Routes>
  );
}

export default App; 
