
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/Home/HomePage';

// Nếu sau này có thêm trang khác thì import tiếp vào đây
// import RecipeDetail from './pages/Recipe/RecipeDetail';

function App() {
  return (
    <Routes>
      {/* Route Cha: MainLayout (Có Sidebar + Navbar + Footer) */}
      <Route path="/" element={<MainLayout />}>
        
        {/* Route Con: Trang chủ (Hiện ở vị trí Outlet của MainLayout) */}
        <Route index element={<HomePage />} />

        {/* Ví dụ sau này thêm trang chi tiết món ăn */}
        {/* <Route path="recipes/:id" element={<RecipeDetail />} /> */}
        
      </Route>
      
      {/* Sau này làm trang Admin hoặc Login thì thêm Route ở ngoài này */}
    </Routes>
  );
}

export default App;