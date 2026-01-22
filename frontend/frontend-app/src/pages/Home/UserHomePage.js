import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 
import logo from '../../assets/img/logo.png';
import AIModal from '../../components/AIModal';

// Định nghĩa URL gốc (Nên đưa vào file .env trong thực tế: process.env.REACT_APP_API_URL)
const API_BASE_URL = 'http://localhost:8000';

const UserHomePage = () => {
  const { user } = useAuth();
  
  // --- STATE ---
  const [recipes, setRecipes] = useState([]); // Đổi tên thành recipes cho chung
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Thêm state quản lý lỗi
  
  const [keyword, setKeyword] = useState(""); 
  const [isSearching, setIsSearching] = useState(false);

  // --- HÀM GỌI API CHUNG ---
  // Sử dụng useCallback để tránh tạo lại hàm không cần thiết
  const fetchRecipes = useCallback(async (searchKeyword = "") => {
    setLoading(true);
    setError(null);

    // Dùng AbortController để hủy request nếu component bị unmount hoặc gọi request mới
    const controller = new AbortController(); 
    const signal = controller.signal;

    try {
      let url = `${API_BASE_URL}/api/home`;
      
      // Nếu có keyword thì đổi endpoint sang search
      if (searchKeyword.trim()) {
        url = `${API_BASE_URL}/api/search?keyword=${encodeURIComponent(searchKeyword)}`;
      }

      const response = await fetch(url, { signal });
      
      if (!response.ok) {
        throw new Error(`Lỗi kết nối: ${response.statusText}`);
      }
      
      const jsonData = await response.json();
      
      // Xử lý dữ liệu trả về linh hoạt theo cấu trúc API của bạn
      let dataToSet = [];
      if (jsonData.status === 'success' && jsonData.data) {
          // Trường hợp API Search hoặc chuẩn mới
          dataToSet = Array.isArray(jsonData.data) ? jsonData.data : jsonData.data.new_recipes;
      } else if (jsonData.new_recipes) {
          // Trường hợp API Home cũ
          dataToSet = jsonData.new_recipes;
      }

      setRecipes(dataToSet || []);
      setIsSearching(!!searchKeyword.trim()); // Cập nhật trạng thái đang tìm kiếm

    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error("Lỗi API:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort(); // Hàm cleanup
  }, []);

  // --- EFFECTS ---
  // Gọi API lần đầu khi vào trang
  useEffect(() => {
    fetchRecipes(); 
  }, [fetchRecipes]);

  // --- HANDLERS ---
  const handleSearch = () => {
    if (!keyword.trim()) return;
    fetchRecipes(keyword);
  };

  const handleClearSearch = () => {
    setKeyword("");
    fetchRecipes(""); // Gọi lại API home
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Helper xử lý ảnh
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/400x300?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    // Đảm bảo không bị dư dấu /
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${API_BASE_URL}/${cleanPath}`; 
  };

  return (
    <>
      <div className="container py-4">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-5 mt-1">
           <img src={logo} alt="Logo" style={{ height: '45px', marginBottom: '15px' }} />
           
           {user && <h4 className="fw-bold text-dark">Hôm nay bạn muốn nấu gì, <span className="text-success">{user.name}</span>?</h4>}
           
           <div className="position-relative w-100 mx-auto mt-4" style={{ maxWidth: '650px' }}>
               <input 
                   type="text" 
                   className="form-control rounded-pill py-3 px-4 shadow-sm border-0" 
                   placeholder="Tìm tên món, nguyên liệu..." 
                   style={{fontSize: '1.1rem', paddingRight: '120px'}} 
                   value={keyword}
                   onChange={(e) => setKeyword(e.target.value)}
                   onKeyDown={handleKeyDown}
               />
               
               {/* Nút xóa nhanh nếu đang nhập */}
               {keyword && (
                 <button 
                    className="btn position-absolute top-50 translate-middle-y text-muted"
                    style={{ right: '100px' }}
                    onClick={() => setKeyword('')}
                 >
                    <i className="fa-solid fa-xmark"></i>
                 </button>
               )}

               <button 
                   className="btn btn-success position-absolute top-50 end-0 translate-middle-y me-2 rounded-pill px-4 fw-bold"
                   onClick={handleSearch}
                   disabled={loading}
               >
                   {loading ? <span className="spinner-border spinner-border-sm"></span> : 'Tìm Kiếm'}
               </button>
           </div>
        </div>
        
        {/* --- NÚT QUAY LẠI --- */}
        {isSearching && (
            <div className="d-flex align-items-center justify-content-between mb-4">
                <button className="btn btn-outline-secondary rounded-pill px-3" onClick={handleClearSearch}>
                    <i className="fa-solid fa-arrow-left me-2"></i> Quay lại trang chủ
                </button>
                <span className="text-muted fst-italic">Kết quả cho: "{keyword}"</span>
            </div>
        )}

        {/* --- TITLE --- */}
        {!isSearching && !loading && !error && <h5 className="mb-3 text-secondary fw-bold border-start border-4 border-success ps-2">Gợi Ý Mới Nhất</h5>}
        
        {/* --- ERROR MESSAGE --- */}
        {error && (
            <div className="alert alert-danger text-center" role="alert">
                <i className="fa-solid fa-circle-exclamation me-2"></i> {error}
                <br/>
                <button className="btn btn-sm btn-outline-danger mt-2" onClick={() => fetchRecipes(keyword)}>Thử lại</button>
            </div>
        )}

        {/* --- RECIPE LIST --- */}
        <div className="row g-4">
            {loading ? (
                // Loading Skeleton hoặc Spinner
                <div className="col-12 text-center py-5">
                    <div className="spinner-border text-success" style={{width: '3rem', height: '3rem'}} role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Đang tìm món ngon...</p>
                </div>
            ) : recipes.length > 0 ? (
                recipes.map((recipe) => (
                    <div className="col-6 col-md-4 col-lg-3" key={recipe.id}>
                        {/* Wrap trong Link để click được */}
                        <Link to={`/recipes/${recipe.id}`} className="text-decoration-none text-dark">
                            <div className="card h-100 border-0 shadow-sm card-hover-effect">
                               <div className="position-relative overflow-hidden rounded-top">
                                   <img 
                                       src={getImageUrl(recipe.main_image)} 
                                       alt={recipe.title}
                                       className="card-img-top object-fit-cover transition-transform"
                                       style={{ height: '200px', width: '100%' }}
                                       onError={(e) => {
                                           e.target.onerror = null; 
                                           e.target.src = "https://via.placeholder.com/400x300?text=No+Image"; 
                                       }} 
                                   />
                                   {/* Badge thời gian nấu (Optional) */}
                                   <span className="position-absolute bottom-0 end-0 bg-white px-2 py-1 m-2 rounded shadow-sm text-success small fw-bold">
                                     <i className="fa-regular fa-clock me-1"></i>{recipe.cooking_time || 30}p
                                   </span>
                               </div>
                                <div className="card-body p-3">
                                    <h6 className="card-title fw-bold text-truncate mb-1" title={recipe.title}>{recipe.title}</h6>
                                    <div className="d-flex align-items-center justify-content-between mt-2">
                                        <small className="text-muted">
                                            <i className="fa-solid fa-fire me-1 text-warning"></i> Dễ làm
                                        </small>
                                        <small className="text-success fw-bold">Xem ngay</small>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))
            ) : (
                !error && (
                    <div className="col-12 text-center text-muted py-5">
                        <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
                            <i className="fa-solid fa-utensils fa-3x text-secondary opacity-50"></i>
                        </div>
                        <p className="fs-5">Không tìm thấy món ăn nào phù hợp.</p>
                        {isSearching && <button className="btn btn-link text-success" onClick={handleClearSearch}>Xem tất cả món ăn</button>}
                    </div>
                )
            )}
        </div>

      </div>

      {/* --- MODAL AI --- */}
      <AIModal /> 
    </>
  );
};

export default UserHomePage;