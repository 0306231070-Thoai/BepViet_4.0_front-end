import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';
import Footer from '../../components/Layout/footer';
import '../../assets/css/cookbook.css';

const CookbookList = () => {
    const navigate = useNavigate();
    const [cookbooks, setCookbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State cho Modal tạo mới
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // Danh sách các ảnh mặc định có sẵn trong thư mục public/img/
    const defaultImages = ['macdinh.png', 'trangmieng.png', 'antoi.png', 'ansang.png'];

    const fetchCookbooks = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('http://127.0.0.1:8000/api/cookbooks', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });

            const result = await response.json();
            if (result.status === 'success') {
                setCookbooks(result.data || []);
            }
        } catch (err) {
            console.error("Lỗi kết nối API:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCookbooks();
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
        setName('');
        setDescription('');
    };

    const handleCreateCookbook = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/cookbooks', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    description: description
                    // Tuyệt đối KHÔNG gửi trường 'image' lên vì CSDL không có cột này
                })
            });

            const result = await response.json();
            if (result.status === 'success') {
                handleCloseModal();
                fetchCookbooks();
            } else {
                alert(result.message || "Lỗi khi tạo bộ sưu tập");
            }
        } catch (err) {
            console.error("Lỗi:", err);
            alert("Không thể kết nối đến máy chủ");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div id="wrapper" className="d-flex">
            <Sidebar />
            <div id="page-content-wrapper" className="w-100 bg-light d-flex flex-column min-vh-100">
                <Navbar />

                <div className="container-fluid py-4 px-4 flex-grow-1">
                    <div className="mb-4">
                        <h2 className="fw-bold">Bộ sưu tập của tôi</h2>
                        <p className="text-muted mb-0">Lưu giữ và tổ chức các công thức yêu thích của bạn.</p>
                    </div>

                    <div className="cookbook-grid">
                        {/* Card tạo mới luôn nằm đầu tiên */}
                        <div className="cookbook-card create-card shadow-sm border-dashed"
                            onClick={() => setShowModal(true)}
                            style={{ cursor: 'pointer' }}>
                            <div className="d-flex flex-column align-items-center justify-content-center h-100 text-secondary">
                                <i className="bi bi-plus-circle-fill display-5 mb-2">+</i>
                                <p className="fw-bold mb-0">Tạo mới</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-5 w-100"><div className="spinner-border text-success"></div></div>
                        ) : (
                            cookbooks.map((item, index) => {
                                // TỰ ĐỘNG GÁN ẢNH: Lấy ảnh theo thứ tự index (0, 1, 2, 3 rồi quay lại 0)
                                const displayImage = defaultImages[index % defaultImages.length];

                                return (
                                    <div
                                        className="cookbook-card shadow-sm clickable-card"
                                        key={item.id}
                                        onClick={() => navigate(`/cookbooks/${item.id}`)}
                                    >
                                        <div className="card-img-container">
                                            <img
                                                src={`/img/${displayImage}`}
                                                className="cookbook-img"
                                                alt={item.name}
                                                onError={(e) => { e.target.src = '/img/macdinh.png'; }}
                                            />
                                            <div className="recipe-count-badge">
                                                {item.recipes_count || 0} món ăn
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <h5 className="fw-bold text-truncate mb-1">{item.name}</h5>
                                            <p className="text-muted small text-description mb-2">
                                                {item.description || "Bấm để xem danh sách món ăn..."}
                                            </p>
                                            <div className="d-flex justify-content-between align-items-center mt-2">
                                                <small className="text-secondary opacity-75">
                                                    {item.updated_at ? new Date(item.updated_at).toLocaleDateString('vi-VN') : 'Mới'}
                                                </small>
                                                <i className="bi bi-chevron-right text-success"></i>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* MODAL TẠO BỘ SƯU TẬP (Đã lược bỏ phần chọn ảnh bìa) */}
                {showModal && (
                    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1050 }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
                                <form onSubmit={handleCreateCookbook}>
                                    <div className="modal-header border-0 pb-0">
                                        <h5 className="modal-title fw-bold">Tạo bộ sưu tập mới</h5>
                                        <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                                    </div>
                                    <div className="modal-body p-4">
                                        <div className="mb-3">
                                            <label className="form-label fw-bold small">Tên bộ sưu tập</label>
                                            <input type="text" className="form-control shadow-none" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ví dụ: Món ăn sáng, Thực đơn giảm cân..." />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-bold small">Mô tả (không bắt buộc)</label>
                                            <textarea className="form-control shadow-none" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" placeholder="Bộ sưu tập này dùng để..."></textarea>
                                        </div>
                                        <p className="text-muted small italic text-center">Hình ảnh bìa sẽ được hệ thống tự động gán sinh động.</p>
                                    </div>
                                    <div className="modal-footer border-0">
                                        <button type="button" className="btn btn-light px-4 rounded-pill" onClick={handleCloseModal}>Hủy</button>
                                        <button type="submit" className="btn btn-success px-4 fw-bold rounded-pill" disabled={isSubmitting}>
                                            {isSubmitting ? 'Đang tạo...' : 'Tạo ngay'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
                <Footer />
            </div>
        </div>
    );
};

export default CookbookList;