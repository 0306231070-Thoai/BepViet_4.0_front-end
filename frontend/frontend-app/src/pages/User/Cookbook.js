import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm để điều hướng
import Navbar from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';
import Footer from '../../components/Layout/footer';
import '../../assets/css/cookbook.css';

const CookbookList = () => {
    const navigate = useNavigate();
    const [cookbooks, setCookbooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // State cho Modal tạo mới
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedImage, setSelectedImage] = useState('macdinh.png');

    const availableImages = ['macdinh.png', 'trangmieng.png', 'antoi.png', 'ansang.png'];

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

    const handleCreateCookbook = async (e) => {
        e.preventDefault();
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
                    description: description,
                    image: selectedImage
                })
            });

            const result = await response.json();
            if (result.status === 'success') {
                setShowModal(false);
                setName('');
                setDescription('');
                fetchCookbooks();
            }
        } catch (err) {
            console.error("Lỗi tạo bộ sưu tập:", err);
        }
    };

    return (
        <div id="wrapper" className="d-flex">
            <Sidebar />
            <div id="page-content-wrapper" className="w-100 bg-light d-flex flex-column min-vh-100">
                <Navbar />

                <div className="container-fluid py-4 px-4 flex-grow-1">
                    <div className="mb-4 d-flex justify-content-between align-items-end">
                        <div>
                            <h2 className="fw-bold">Bộ sưu tập của tôi</h2>
                            <p className="text-muted mb-0">Lưu giữ và tổ chức các công thức yêu thích của bạn.</p>
                        </div>
                    </div>

                    <div className="cookbook-grid">
                        {/* Card tạo mới */}
                        <div className="cookbook-card create-card shadow-sm border-dashed" onClick={() => setShowModal(true)}>
                            <div className="d-flex flex-column align-items-center justify-content-center h-100 text-secondary">
                                <i className="bi bi-plus-circle-fill display-5 mb-2">+</i>
                                <p className="fw-bold mb-0">Tạo mới</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-5 w-100"><div className="spinner-border text-success"></div></div>
                        ) : (
                            cookbooks.map(item => (
                                <div
                                    className="cookbook-card shadow-sm clickable-card"
                                    key={item.id}
                                    onClick={() => navigate(`/cookbooks/${item.id}`)} // Điều hướng đến trang chi tiết
                                >
                                    <div className="card-img-container">
                                        <img
                                            src={`/img/${item.image || 'macdinh.png'}`}
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
                                                {new Date(item.updated_at).toLocaleDateString('vi-VN')}
                                            </small>
                                            <i className="bi bi-chevron-right text-success"></i>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* MODAL TẠO BỘ SƯU TẬP */}
                {showModal && (
                    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg">
                                <form onSubmit={handleCreateCookbook}>
                                    <div className="modal-header border-0 pb-0">
                                        <h5 className="modal-title fw-bold">Tạo bộ sưu tập mới</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label fw-bold small">Tên bộ sưu tập</label>
                                            <input type="text" className="form-control shadow-none" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ví dụ: Món ăn sáng, Thực đơn giảm cân..." />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-bold small">Mô tả (không bắt buộc)</label>
                                            <textarea className="form-control shadow-none" value={description} onChange={(e) => setDescription(e.target.value)} rows="2" placeholder="Bộ sưu tập này dùng để..."></textarea>
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label fw-bold small">Chọn phong cách ảnh bìa</label>
                                            <div className="d-flex gap-2 flex-wrap mt-1">
                                                {availableImages.map(img => (
                                                    <div
                                                        key={img}
                                                        className={`image-option-container ${selectedImage === img ? 'active' : ''}`}
                                                        onClick={() => setSelectedImage(img)}
                                                    >
                                                        <img
                                                            src={`/img/${img}`}
                                                            className="rounded img-option"
                                                            alt="Option"
                                                        />
                                                        {selectedImage === img && <div className="check-badge"><i className="bi bi-check-circle-fill"></i></div>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer border-0">
                                        <button type="button" className="btn btn-light px-4" onClick={() => setShowModal(false)}>Hủy</button>
                                        <button type="submit" className="btn btn-success px-4 fw-bold">Tạo ngay</button>
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