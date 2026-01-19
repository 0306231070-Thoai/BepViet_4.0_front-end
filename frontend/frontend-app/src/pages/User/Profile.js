import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';
import Footer from '../../components/Layout/footer';
import '../../assets/css/profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('info');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // State cho Form cập nhật
    const [formData, setFormData] = useState({
        username: '',
        nickname: '',
        phone: '',
        bio: ''
    });

    const getImageUrl = (path) => {
        if (!path) return "https://via.placeholder.com/150";
        if (path.startsWith('http')) return path;
        return `http://127.0.0.1:8000/storage/${path}`;
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://127.0.0.1:8000/api/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                const result = await response.json();
                if (response.ok) {
                    setUser(result.data);
                    setFormData({
                        username: result.data.username || '',
                        nickname: result.data.nickname || '',
                        phone: result.data.phone || '',
                        bio: result.data.bio || ''
                    });
                } else if (response.status === 401) {
                    navigate('/login');
                }
            } catch (error) {
                console.error("Lỗi kết nối:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://127.0.0.1:8000/api/profile/update', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (response.ok) {
                alert("Cập nhật thành công!");
                setUser(result.data);
            }
        } catch (error) {
            alert("Lỗi khi cập nhật!");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div id="wrapper" className="d-flex">
            <Sidebar />
            <div id="page-content-wrapper" className="w-100 bg-light">
                <Navbar />
                <div className="container mt-4 mb-5">
                    <div className="row justify-content-center">
                        {/* CỘT TRÁI */}
                        <div className="col-md-4 mb-4">
                            <div className="card border-0 shadow-sm p-4 text-center rounded-4">
                                <img
                                    src={getImageUrl(user?.avatar)}
                                    className="rounded-circle mx-auto mb-3 border shadow-sm"
                                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                    alt="Avatar"
                                />
                                <h4 className="fw-bold mb-1">{user?.username}</h4>
                                <p className="text-muted small mb-3">@{user?.nickname || 'nguoidung'}</p>

                                <div className="list-group list-group-flush text-start border rounded-3 overflow-hidden">
                                    <button onClick={() => setActiveTab('info')} className={`list-group-item list-group-item-action py-3 border-0 ${activeTab === 'info' ? 'bg-light text-success fw-bold' : ''}`}>Thông tin cá nhân</button>
                                    <button onClick={() => setActiveTab('recipes')} className={`list-group-item list-group-item-action py-3 border-0 ${activeTab === 'recipes' ? 'bg-light text-success fw-bold' : ''}`}>Công thức đã đăng</button>
                                    <button onClick={() => setActiveTab('password')} className={`list-group-item list-group-item-action py-3 border-0 ${activeTab === 'password' ? 'bg-light text-success fw-bold' : ''}`}>Đổi mật khẩu</button>
                                    <button onClick={handleLogout} className="list-group-item list-group-item-action py-3 border-0 text-danger fw-bold">Đăng xuất</button>
                                </div>
                            </div>
                        </div>

                        {/* CỘT PHẢI */}
                        <div className="col-md-7">
                            <div className="card border-0 shadow-sm rounded-4 p-4 min-vh-50">
                                {activeTab === 'info' && (
                                    <>
                                        <h5 className="fw-bold mb-4">Cập nhật thông tin</h5>
                                        <form className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label small fw-semibold">Họ và tên</label>
                                                <input type="text" name="username" className="form-control" value={formData.username} onChange={handleInputChange} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-semibold">Nickname</label>
                                                <input type="text" name="nickname" className="form-control" value={formData.nickname} onChange={handleInputChange} />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label small fw-semibold">Email</label>
                                                <input type="email" className="form-control bg-light" value={user?.email} disabled />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label small fw-semibold">Số điện thoại</label>
                                                <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleInputChange} />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label small fw-semibold">Tiểu sử</label>
                                                <textarea name="bio" className="form-control" rows="3" value={formData.bio} onChange={handleInputChange}></textarea>
                                            </div>
                                            <div className="col-12">
                                                <button type="button" onClick={handleUpdate} className="btn btn-warning text-white fw-bold px-4 rounded-3">Lưu thay đổi</button>
                                            </div>
                                        </form>
                                    </>
                                )}
                                {/* ... Các tab khác tương tự ... */}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Profile;