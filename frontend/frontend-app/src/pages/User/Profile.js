import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Import các thành phần Layout của bạn
import Navbar from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';
import Footer from '../../components/Layout/footer';

// Import CSS (Chú ý chữ Css viết hoa theo cấu trúc của bạn)
import '../../assets/Css/profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('info');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null); // Khởi tạo là null để kiểm tra dữ liệu

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/api/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data.data);
            } catch (error) {
                console.error("Lỗi fetch profile:", error);
                if (error.response?.status === 401) navigate('/login');
            } finally {
                setLoading(false); // Kết thúc trạng thái chờ
            }
        };
        fetchProfile();
    }, [navigate]);

    // 1. Kiểm tra trạng thái tải dữ liệu
    if (loading) return <div className="text-center mt-5">Đang tải hồ sơ...</div>;

    // 2. Kiểm tra nếu user vẫn null sau khi loading xong
    if (!user) return <div className="text-center mt-5">Không tìm thấy dữ liệu người dùng.</div>;

    return (
        <div id="wrapper" className="d-flex">
            {/* SIDEBAR */}
            <Sidebar />

            <div id="page-content-wrapper" className="w-100 bg-light">
                {/* HEAD (NAVBAR) */}
                <Navbar />

                <div className="container mt-4 mb-5">
                    <div className="row">
                        {/* Cột trái: Avatar & Tab Menu */}
                        <div className="col-md-4 mb-4">
                            <div className="card border-0 shadow-sm p-4 text-center rounded-4">
                                {/* Sử dụng optional chaining hoặc giá trị mặc định để tránh lỗi undefined */}
                                <img
                                    src={user?.avatar || "https://via.placeholder.com/150"}
                                    className="profile-avatar rounded-circle mx-auto mb-3"
                                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                    alt="Avatar"
                                />
                                <h4 className="fw-bold">{user?.username || 'Thành viên'}</h4>
                                <p className="text-muted small">@{user?.username}</p>

                                <div className="list-group list-group-flush mt-3 rounded-3 border overflow-hidden">
                                    <button
                                        onClick={() => setActiveTab('info')}
                                        className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === 'info' ? 'active bg-warning text-white' : ''}`}
                                    >
                                        Thông tin cá nhân
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('password')}
                                        className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === 'password' ? 'active bg-warning text-white' : ''}`}
                                    >
                                        Đổi mật khẩu
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Cột phải: Nội dung chi tiết */}
                        <div className="col-md-8">
                            <div className="card border-0 shadow-sm rounded-4 p-4">
                                <h5 className="fw-bold mb-4">Thiết lập tài khoản</h5>
                                {activeTab === 'info' ? (
                                    <form>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Họ và tên</label>
                                                <input type="text" className="form-control" defaultValue={user?.username} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Biệt danh</label>
                                                <input type="text" className="form-control" defaultValue={user?.nickname} />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Email</label>
                                            <input type="email" className="form-control bg-light" value={user?.email || ''} disabled />
                                        </div>
                                        <button type="button" className="btn btn-warning text-white fw-bold px-4 rounded-pill">Lưu thay đổi</button>
                                    </form>
                                ) : (
                                    <div className="text-center py-5">Chức năng đang cập nhật...</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOT (FOOTER) */}
                <Footer />
            </div>
        </div>
    );
};

export default Profile;