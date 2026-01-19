import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';
import Footer from '../../components/Layout/footer';

// Import CSS (Chú ý chữ Css viết hoa theo cấu trúc của bạn)
import '../../assets/css/profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('info'); // info, password, notify, recipes, cookbook
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

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

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div id="wrapper" className="d-flex">
            {/* SIDEBAR BÊN TRÁI (GIỐNG HÌNH) */}
            <Sidebar />

            <div id="page-content-wrapper" className="w-100 bg-light">
                <Navbar />

                <div className="container mt-4 mb-5">
                    <div className="row justify-content-center">
                        {/* CỘT TRÁI: THÔNG TIN TÓM TẮT & MENU */}
                        <div className="col-md-4 mb-4">
                            <div className="card border-0 shadow-sm p-4 text-center rounded-4">
                                <img
                                    src={user?.avatar || "https://via.placeholder.com/150"}
                                    className="rounded-circle mx-auto mb-3 border"
                                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                    alt="Avatar"
                                />
                                <h4 className="fw-bold mb-1">{user?.username || 'Nguyễn Văn A'}</h4>
                                <p className="text-muted small mb-3">@{user?.nickname || 'nguyenvana'}</p>
                                <button className="btn btn-outline-primary btn-sm rounded-pill px-4 mb-4">Đổi ảnh đại diện</button>

                                <div className="list-group list-group-flush text-start border rounded-3 overflow-hidden">
                                    <button onClick={() => setActiveTab('info')} className={`list-group-item list-group-item-action py-3 border-0 ${activeTab === 'info' ? 'bg-light-green text-success fw-bold' : ''}`}>Thông tin cá nhân</button>
                                    <button onClick={() => setActiveTab('recipes')} className={`list-group-item list-group-item-action py-3 border-0 ${activeTab === 'recipes' ? 'bg-light-green text-success fw-bold' : ''}`}>Công thức đã đăng</button>
                                    <button onClick={() => setActiveTab('cookbook')} className={`list-group-item list-group-item-action py-3 border-0 ${activeTab === 'cookbook' ? 'bg-light-green text-success fw-bold' : ''}`}>Kho món ngon (Cookbook)</button>
                                    <button onClick={() => setActiveTab('password')} className={`list-group-item list-group-item-action py-3 border-0 ${activeTab === 'password' ? 'bg-light-green text-success fw-bold' : ''}`}>Đổi mật khẩu</button>
                                    <button onClick={() => setActiveTab('notify')} className={`list-group-item list-group-item-action py-3 border-0 ${activeTab === 'notify' ? 'bg-light-green text-success fw-bold' : ''}`}>Thông báo</button>
                                    <button className="list-group-item list-group-item-action py-3 border-0 text-danger fw-bold">Đăng xuất</button>
                                </div>
                            </div>
                        </div>

                        {/* CỘT PHẢI: NỘI DUNG CHI TIẾT THEO TAB */}
                        <div className="col-md-7">
                            <div className="card border-0 shadow-sm rounded-4 p-4 min-vh-50">

                                {/* TAB 1: THÔNG TIN CÁ NHÂN (GIỐNG HÌNH MẪU) */}
                                {activeTab === 'info' && (
                                    <>
                                        <h5 className="fw-bold mb-4">Cập nhật thông tin</h5>
                                        <form className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label small fw-semibold">Họ và tên</label>
                                                <input type="text" className="form-control" defaultValue={user?.username} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-semibold">Tên hiển thị (Nickname)</label>
                                                <input type="text" className="form-control" defaultValue={user?.nickname} />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label small fw-semibold">Email</label>
                                                <input type="email" className="form-control bg-light" value={user?.email} disabled />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label small fw-semibold">Số điện thoại</label>
                                                <input type="text" className="form-control" placeholder="0380******" />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label small fw-semibold">Tiểu sử ngắn</label>
                                                <textarea className="form-control" rows="3" placeholder="Chia sẻ đam mê ẩm thực của bạn..."></textarea>
                                            </div>
                                            <div className="col-12">
                                                <button type="button" className="btn btn-warning text-white fw-bold px-4 rounded-3">Lưu thay đổi</button>
                                            </div>
                                        </form>
                                    </>
                                )}

                                {/* TAB 2: CÔNG THỨC ĐÃ ĐĂNG */}
                                {activeTab === 'recipes' && (
                                    <>
                                        <h5 className="fw-bold mb-4">Công thức của tôi </h5>
                                        <div className="row g-3">
                                            {/* Logic hiển thị danh sách công thức đã đăng [cite: 26] */}
                                            <div className="text-center py-5 text-muted">
                                                <i className="fa-solid fa-utensils fa-3x mb-3"></i>
                                                <p>Bạn chưa đăng công thức nào.</p>
                                                <button className="btn btn-sm btn-success rounded-pill px-3">+ Đăng món mới</button>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* TAB 3: COOKBOOK (BỘ SƯU TẬP) */}
                                {activeTab === 'cookbook' && (
                                    <>
                                        <h5 className="fw-bold mb-4">Bộ sưu tập Cookbook </h5>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <div className="card p-4 border-dashed text-center rounded-4 cursor-pointer">
                                                    <i className="fa-solid fa-folder-plus fa-2x text-warning mb-2"></i>
                                                    <p className="mb-0 small fw-bold">Tạo Cookbook mới</p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* TAB 4: ĐỔI MẬT KHẨU */}
                                {activeTab === 'password' && (
                                    <>
                                        <h5 className="fw-bold mb-4">Bảo mật tài khoản</h5>
                                        <div className="mb-3">
                                            <label className="form-label small">Mật khẩu hiện tại</label>
                                            <input type="password" name="old_password" className="form-control" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label small">Mật khẩu mới</label>
                                            <input type="password" name="new_password" className="form-control" />
                                        </div>
                                        <button className="btn btn-warning text-white fw-bold px-4">Cập nhật mật khẩu</button>
                                    </>
                                )}

                                {/* TAB 5: THÔNG BÁO */}
                                {activeTab === 'notify' && (
                                    <>
                                        <h5 className="fw-bold mb-4">Thông báo tương tác [cite: 45]</h5>
                                        <div className="list-group list-group-flush">
                                            <div className="list-group-item border-0 px-0">
                                                <p className="mb-1 small"><strong>Admin</strong> đã phê duyệt công thức của bạn.</p>
                                                <span className="text-muted smaller">10 phút trước</span>
                                            </div>
                                        </div>
                                    </>
                                )}
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