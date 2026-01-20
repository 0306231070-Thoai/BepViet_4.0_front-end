import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    const [uploading, setUploading] = useState(false);

    const fileInputRef = useRef(null);

    // Form thông tin cơ bản
    const [infoForm, setInfoForm] = useState({
        username: '',
        email: '',
        bio: '',
    });

    // Form đổi mật khẩu
    const [passwordForm, setPasswordForm] = useState({
        old_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const fetchProfile = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/login'); return; }

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
                setInfoForm({
                    username: result.data.username || '',
                    email: result.data.email || '',
                    bio: result.data.bio || '',
                });
            } else if (response.status === 401) {
                navigate('/login');
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // 1. Xử lý đổi Avatar
    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:8000/api/profile/avatar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: formData
            });

            const result = await res.json();
            if (res.ok) {
                alert("Đổi ảnh đại diện thành công!");
                setUser({ ...user, avatar: result.data.avatar });
            } else {
                alert(result.message || "Lỗi upload ảnh.");
            }
        } catch (error) {
            alert("Lỗi kết nối server.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // 2. Xử lý cập nhật Username & Bio
    const handleUpdateInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:8000/api/profile/update', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    username: infoForm.username,
                    bio: infoForm.bio,
                })
            });

            const result = await res.json();
            if (res.ok) {
                alert("Cập nhật thông tin thành công!");
                setUser({ ...user, username: infoForm.username, bio: infoForm.bio });
            } else {
                alert(result.message || "Lỗi cập nhật dữ liệu.");
            }
        } catch (error) {
            alert("Lỗi kết nối server.");
        }
    };

    // 3. Xử lý đổi mật khẩu
    const handleChangePassword = async () => {
        if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
            alert("Mật khẩu mới không trùng khớp!");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:8000/api/profile/change-password', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(passwordForm)
            });

            const result = await res.json();
            if (res.ok) {
                alert("Đổi mật khẩu thành công!");
                setPasswordForm({ old_password: '', new_password: '', new_password_confirmation: '' });
            } else {
                alert(result.message || "Mật khẩu cũ không đúng.");
            }
        } catch (error) {
            alert("Lỗi kết nối.");
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div id="wrapper" className="d-flex">
            <Sidebar />
            <div id="page-content-wrapper" className="w-100 bg-light">
                <Navbar />

                <input type="file" ref={fileInputRef} onChange={handleAvatarChange} style={{ display: 'none' }} accept="image/*" />

                <div className="container mt-4 mb-5">
                    <div className="row justify-content-center">
                        {/* CỘT TRÁI: CARD AVATAR & MENU */}
                        <div className="col-md-4 mb-4">
                            <div className="card border-0 shadow-sm p-4 text-center rounded-4">
                                <div className="position-relative d-inline-block mx-auto mb-3">
                                    <img
                                        src={user?.avatar ? `http://127.0.0.1:8000/storage/${user.avatar}` : '/default-avatar.png'}
                                        className="rounded-circle border shadow-sm"
                                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                        alt="Avatar"
                                    />
                                    {uploading && (
                                        <div className="position-absolute top-50 start-50 translate-middle">
                                            <div className="spinner-border text-primary spinner-border-sm"></div>
                                        </div>
                                    )}
                                </div>
                                <h4 className="fw-bold mb-1">{user?.username}</h4>
                                <p className="text-muted small mb-3">{user?.email}</p>

                                <button
                                    className="btn btn-outline-primary btn-sm rounded-pill px-4 mb-4"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                >
                                    {uploading ? 'Đang tải...' : 'Đổi ảnh đại diện'}
                                </button>

                                <div className="list-group list-group-flush text-start border rounded-3 overflow-hidden">
                                    <button onClick={() => setActiveTab('info')} className={`list-group-item list-group-item-action py-3 border-0 ${activeTab === 'info' ? 'bg-light text-warning fw-bold' : ''}`}>Thông tin cá nhân</button>
                                    <button onClick={() => setActiveTab('password')} className={`list-group-item list-group-item-action py-3 border-0 ${activeTab === 'password' ? 'bg-light text-warning fw-bold' : ''}`}>Đổi mật khẩu</button>
                                    <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="list-group-item list-group-item-action py-3 border-0 text-danger fw-bold">Đăng xuất</button>
                                </div>
                            </div>
                        </div>

                        {/* CỘT PHẢI: NỘI DUNG CHI TIẾT */}
                        <div className="col-md-7">
                            <div className="card border-0 shadow-sm rounded-4 p-4 min-vh-50">
                                {/* TAB 1: THÔNG TIN */}
                                {activeTab === 'info' && (
                                    <>
                                        <h5 className="fw-bold mb-4">Cập nhật thông tin</h5>
                                        <div className="row g-3">
                                            <div className="col-12">
                                                <label className="form-label small fw-semibold">Họ và tên</label>
                                                <input type="text" className="form-control" value={infoForm.username}
                                                    onChange={e => setInfoForm({ ...infoForm, username: e.target.value })} />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label small fw-semibold">Email</label>
                                                <input type="email" className="form-control bg-light" value={infoForm.email} disabled />
                                                <small className="text-muted text-italic">* Email không thể thay đổi</small>
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label small fw-semibold">Tiểu sử</label>
                                                <textarea className="form-control" rows="4" value={infoForm.bio}
                                                    onChange={e => setInfoForm({ ...infoForm, bio: e.target.value })}
                                                    placeholder="Giới thiệu một chút về bạn..."></textarea>
                                            </div>
                                            <div className="col-12 mt-4">
                                                <button onClick={handleUpdateInfo} className="btn btn-warning text-white fw-bold px-4 rounded-3">Lưu thay đổi</button>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* TAB 2: ĐỔI MẬT KHẨU */}
                                {activeTab === 'password' && (
                                    <>
                                        <h5 className="fw-bold mb-4">Bảo mật tài khoản</h5>
                                        <div className="row g-3">
                                            <div className="col-12">
                                                <label className="form-label small fw-semibold">Mật khẩu hiện tại</label>
                                                <input type="password" name="old_password" className="form-control"
                                                    value={passwordForm.old_password}
                                                    onChange={e => setPasswordForm({ ...passwordForm, old_password: e.target.value })} />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label small fw-semibold">Mật khẩu mới</label>
                                                <input type="password" name="new_password" className="form-control"
                                                    value={passwordForm.new_password}
                                                    onChange={e => setPasswordForm({ ...passwordForm, new_password: e.target.value })} />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label small fw-semibold">Xác nhận mật khẩu mới</label>
                                                <input type="password" name="new_password_confirmation" className="form-control"
                                                    value={passwordForm.new_password_confirmation}
                                                    onChange={e => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })} />
                                            </div>
                                            <div className="col-12 mt-4">
                                                <button onClick={handleChangePassword} className="btn btn-primary fw-bold px-4 rounded-3">Cập nhật mật khẩu</button>
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