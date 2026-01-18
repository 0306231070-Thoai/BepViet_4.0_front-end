import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Import các thành phần Layout từ thư mục components
import Navbar from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';
import Footer from '../components/Layout/footer';

// Import CSS
import '../assets/Css/profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('info');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({
        username: '', nickname: '', email: '', phone: '', bio: '', address: 'Hà Nội', avatar: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/api/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data.data);
            } catch (error) {
                if (error.response?.status === 401) navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    if (loading) return <div className="text-center mt-5">Đang tải...</div>;

    return (
        <div id="wrapper" className="d-flex">
            {/* 1. SIDEBAR */}
            <Sidebar />

            <div id="page-content-wrapper" className="w-100 bg-light">
                {/* 2. NAVBAR (Phần Head) */}
                <Navbar />

                {/* 3. NỘI DUNG CHÍNH (BODY) */}
                <div className="container mt-4 mb-5">
                    <div className="row">
                        {/* Cột trái: Thông tin nhanh */}
                        <div className="col-md-4 mb-4">
                            <div className="card border-0 shadow-sm p-4 text-center">
                                <img
                                    src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"}
                                    className="profile-avatar rounded-circle mx-auto mb-3"
                                    alt="Avatar"
                                />
                                <h4 className="fw-bold">{user.username}</h4>
                                <p className="text-muted small">@{user.username}</p>
                                <p className="small text-secondary">"{user.bio || 'Yêu bếp, nghiện nhà...'}"</p>
                                <button className="btn btn-outline-primary btn-sm w-100 mt-2 rounded-pill">Đổi ảnh đại diện</button>
                            </div>

                            <div className="card border-0 shadow-sm mt-3">
                                <div className="list-group list-group-flush">
                                    <button onClick={() => setActiveTab('info')} className={`list-group-item list-group-item-action border-0 ${activeTab === 'info' ? 'active' : ''}`}>Thông tin cá nhân</button>
                                    <button onClick={() => setActiveTab('password')} className={`list-group-item list-group-item-action border-0 ${activeTab === 'password' ? 'active' : ''}`}>Đổi mật khẩu</button>
                                    <button onClick={() => setActiveTab('notifications')} className={`list-group-item list-group-item-action border-0 ${activeTab === 'notifications' ? 'active' : ''}`}>Thông báo</button>
                                </div>
                            </div>
                        </div>

                        {/* Cột phải: Form cập nhật */}
                        <div className="col-md-8">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-white fw-bold py-3">Cập nhật thông tin</div>
                                <div className="card-body">
                                    <form>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label">Họ và tên</label>
                                                <input type="text" name="username" className="form-control" value={user.username} onChange={handleChange} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Biệt danh</label>
                                                <input type="text" name="nickname" className="form-control" value={user.nickname} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Email</label>
                                            <input type="email" className="form-control bg-light" value={user.email} disabled />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Số điện thoại</label>
                                            <input type="text" name="phone" className="form-control" value={user.phone} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Tiểu sử</label>
                                            <textarea name="bio" className="form-control" rows="3" value={user.bio} onChange={handleChange}></textarea>
                                        </div>
                                        <button type="submit" className="btn btn-warning text-white fw-bold px-4 rounded-pill">Lưu thay đổi</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. FOOTER */}
                <Footer />
            </div>
        </div>
    );
};

export default Profile;