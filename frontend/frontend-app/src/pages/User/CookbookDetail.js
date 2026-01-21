import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';
import Footer from '../../components/Layout/footer';
import '../../assets/css/cookbook.css';

const CookbookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cookbook, setCookbook] = useState(null);
    const [loading, setLoading] = useState(true);

    // Hàm lấy chi tiết bộ sưu tập
    const fetchCookbookDetail = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://127.0.0.1:8000/api/cookbooks/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                setCookbook(result.data);
            } else {
                // Thay vì Alert, chúng ta set cookbook về null để hiển thị giao diện "Không tìm thấy"
                setCookbook(null);
                console.warn("Không tìm thấy bộ sưu tập hoặc có lỗi từ server.");
            }
        } catch (err) {
            console.error("Lỗi kết nối API:", err);
            setCookbook(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchCookbookDetail();
    }, [id, fetchCookbookDetail]);

    // Hàm gỡ món ăn
    const handleRemoveRecipe = async (recipeId) => {
        if (!window.confirm("Bạn có chắc chắn muốn gỡ món này khỏi bộ sưu tập?")) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://127.0.0.1:8000/api/cookbooks/${id}/recipes/${recipeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            if (response.ok) fetchCookbookDetail();
        } catch (err) {
            console.error("Lỗi khi gỡ món ăn:", err);
        }
    };

    // 1. Giao diện đang tải
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <div className="text-center">
                    <div className="spinner-border text-success mb-2"></div>
                    <p className="text-muted fw-bold">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div id="wrapper" className="d-flex">
            <Sidebar />
            <div id="page-content-wrapper" className="w-100 bg-light d-flex flex-column min-vh-100">
                <Navbar />

                <div className="container-fluid py-4 px-4 flex-grow-1">
                    {/* Nút quay lại luôn hiển thị */}
                    <nav aria-label="breadcrumb" className="mb-4">
                        <button className="btn btn-link text-success p-0 fw-bold text-decoration-none" onClick={() => navigate('/cookbooks')}>
                            <i className="bi bi-chevron-left"></i> Quay lại danh sách bộ sưu tập
                        </button>
                    </nav>

                    {!cookbook ? (
                        /* 2. Giao diện khi ID không tồn tại hoặc lỗi (Thay cho Alert) */
                        <div className="card border-0 shadow-sm p-5 text-center">
                            <i className="bi bi-exclamation-circle display-1 text-warning mb-3"></i>
                            <h3 className="fw-bold">Bộ sưu tập không khả dụng</h3>
                            <p className="text-muted">Thông tin bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                            <Link to="/cookbooks" className="btn btn-success rounded-pill px-4">Xem các bộ sưu tập khác</Link>
                        </div>
                    ) : (
                        /* 3. Giao diện chính khi có dữ liệu */
                        <>
                            {/* Header thông tin bộ sưu tập */}
                            <div className="card border-0 shadow-sm mb-5 overflow-hidden">
                                <div className="row g-0 align-items-center">
                                    <div className="col-md-3">
                                        <img
                                            src={`/img/${cookbook.image || 'macdinh.png'}`}
                                            alt={cookbook.name}
                                            className="img-fluid h-100 w-100"
                                            style={{ objectFit: 'cover', minHeight: '200px' }}
                                            onError={(e) => { e.target.src = '/img/macdinh.png'; }}
                                        />
                                    </div>
                                    <div className="col-md-9">
                                        <div className="card-body p-4">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h2 className="fw-bold text-dark mb-1">{cookbook.name}</h2>
                                                    <p className="text-muted mb-3">
                                                        {cookbook.description || "Bộ sưu tập này chưa có mô tả."}
                                                    </p>
                                                </div>
                                                <span className="badge bg-success rounded-pill px-3 py-2">
                                                    {cookbook.recipes?.length || 0} món ăn
                                                </span>
                                            </div>
                                            <hr className="my-3 opacity-10" />
                                            <div className="small text-secondary">
                                                <i className="bi bi-clock-history me-2"></i>
                                                Cập nhật: {new Date(cookbook.updated_at).toLocaleDateString('vi-VN')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Danh sách món ăn */}
                            <h4 className="fw-bold mb-4">Món ăn trong bộ sưu tập</h4>

                            <div className="row g-4">
                                {cookbook.recipes && cookbook.recipes.length > 0 ? (
                                    cookbook.recipes.map(recipe => (
                                        <div className="col-12 col-sm-6 col-lg-3" key={recipe.id}>
                                            <div className="card h-100 border-0 shadow-sm recipe-card-hover">
                                                <div className="position-relative" style={{ height: '180px' }}>
                                                    <img
                                                        src={`http://127.0.0.1:8000/storage/${recipe.main_image}`}
                                                        className="card-img-top h-100 w-100"
                                                        style={{ objectFit: 'cover' }}
                                                        alt={recipe.title}
                                                        onError={(e) => { e.target.src = '/img/macdinh.png'; }}
                                                    />
                                                    <button
                                                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle shadow"
                                                        onClick={() => handleRemoveRecipe(recipe.id)}
                                                        title="Gỡ món ăn"
                                                    >
                                                        <i className="bi bi-x-lg"></i>
                                                    </button>
                                                </div>
                                                <div className="card-body">
                                                    <h6 className="fw-bold text-dark text-truncate">{recipe.title}</h6>
                                                    <div className="d-flex justify-content-between small text-muted mb-3">
                                                        <span><i className="bi bi-stopwatch"></i> {recipe.cooking_time}p</span>
                                                        <span className="text-success fw-bold">{recipe.difficulty}</span>
                                                    </div>
                                                    <Link to={`/recipes/${recipe.id}`} className="btn btn-outline-success btn-sm w-100 rounded-pill">
                                                        Xem chi tiết
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    /* 4. HIỂN THỊ KHI TRỐNG: Luôn chạy và hiển thị nội dung này */
                                    <div className="col-12">
                                        <div className="text-center py-5 bg-white rounded shadow-sm border-dashed">
                                            <i className="bi bi-plus-circle display-4 text-light"></i>
                                            <h5 className="text-muted mt-3">Chưa có món ăn nào ở đây.</h5>
                                            <Link to="/homepage" className="btn btn-success px-4 mt-2 rounded-pill">
                                                Khám phá và thêm món ngay
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default CookbookDetail;