import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyCookbooks = () => {
    const [cookbooks, setCookbooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newBook, setNewBook] = useState({ name: '', description: '' });
    const navigate = useNavigate();

    const fetchCookbooks = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:8000/api/cookbooks', {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const result = await res.json();
            if (res.ok) setCookbooks(result.data);
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCookbooks(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:8000/api/cookbooks', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(newBook)
            });
            if (res.ok) {
                setShowModal(false);
                setNewBook({ name: '', description: '' });
                fetchCookbooks();
            }
        } catch (error) {
            alert("Không thể tạo bộ sưu tập");
        }
    };

    return (
        <div className="cookbook-section">
            <div className="mb-4">
                <h4 className="fw-bold mb-1">Bộ sưu tập của tôi</h4>
                <p className="text-muted small">Lưu giữ và tổ chức các công thức yêu thích của bạn.</p>
            </div>

            {loading ? (
                <div className="text-center py-5"><div className="spinner-border text-warning"></div></div>
            ) : (
                <div className="row g-4">
                    {/* Thẻ Tạo mới - Giống mẫu thiết kế chuyên nghiệp */}
                    <div className="col-6 col-md-4 col-lg-3">
                        <div
                            className="card h-100 border-2 border-dashed d-flex flex-column align-items-center justify-content-center text-muted"
                            style={{ cursor: 'pointer', minHeight: '200px', borderStyle: 'dashed', backgroundColor: '#fafafa' }}
                            onClick={() => setShowModal(true)}
                        >
                            <div className="rounded-circle bg-secondary bg-opacity-10 p-3 mb-2">
                                <i className="bi bi-plus-lg fs-4">+</i>
                            </div>
                            <span className="fw-bold small">Tạo bộ sưu tập</span>
                        </div>
                    </div>

                    {cookbooks.map(book => (
                        <div className="col-6 col-md-4 col-lg-3" key={book.id}>
                            <div
                                className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden cookbook-card"
                                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                onClick={() => navigate(`/profile/cookbook/${book.id}`)}
                            >
                                {/* Ảnh nền - Lấy ảnh món ăn đầu tiên hoặc ảnh mặc định */}
                                <div className="position-relative" style={{ height: '140px' }}>
                                    <img
                                        src={book.cover_image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=500'}
                                        className="w-100 h-100 object-fit-cover"
                                        alt={book.name}
                                    />
                                    <span className="position-absolute top-0 end-0 m-2 badge rounded-pill bg-dark bg-opacity-75">
                                        {book.recipes_count || 0} công thức
                                    </span>
                                </div>

                                <div className="card-body p-3">
                                    <h6 className="fw-bold text-truncate mb-1">{book.name}</h6>
                                    <p className="text-muted extra-small text-truncate-2 mb-2" style={{ fontSize: '0.75rem', height: '32px' }}>
                                        {book.description || 'Chưa có mô tả'}
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="extra-small text-muted" style={{ fontSize: '0.7rem' }}>
                                            Cập nhật: {book.updated_at_human || 'Vừa xong'}
                                        </span>
                                        <i className="bi bi-three-dots text-muted"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal tạo mới (giữ nguyên logic của bạn nhưng tối ưu CSS) */}
            {showModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow">
                            <form onSubmit={handleCreate}>
                                <div className="modal-header border-0">
                                    <h5 className="fw-bold">Tạo Cookbook mới</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Tên bộ sưu tập</label>
                                        <input type="text" className="form-control" placeholder="Ví dụ: Món ngon mỗi ngày" required
                                            onChange={e => setNewBook({ ...newBook, name: e.target.value })} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Mô tả</label>
                                        <textarea className="form-control" rows="3" placeholder="Ghi chú ngắn gọn về bộ sưu tập này..."
                                            onChange={e => setNewBook({ ...newBook, description: e.target.value })}></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer border-0">
                                    <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowModal(false)}>Hủy</button>
                                    <button type="submit" className="btn btn-warning text-white fw-bold rounded-pill px-4">Tạo ngay</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyCookbooks;