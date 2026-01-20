import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';
import Footer from '../../components/Layout/footer';
import '../../assets/css/profile.css';
import MyCookbooks from './MyCookbooks';

const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('info');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [myRecipes, setMyRecipes] = useState([]);
    const [, setMyCookbooks] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [infoForm, setInfoForm] = useState({
        username: '',
        email: '',
        bio: '',
    });

    const [passwordForm, setPasswordForm] = useState({
        old_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    // 1. Lấy thông tin Profile & Xử lý logic tên từ Email
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
                const userData = result.data;
                // Lấy phần trước dấu @ của email (ví dụ: hoai10@gmail.com -> hoai10)
                const emailPrefix = userData.email ? userData.email.split('@')[0] : '';
                const displayName = userData.username || emailPrefix;

                setUser({ ...userData, username: displayName });
                setInfoForm({
                    username: displayName,
                    email: userData.email || '',
                    bio: userData.bio || '',
                });
            } else if (response.status === 401) {
                localStorage.removeItem('token');
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

    // 2. Xử lý đổi Avatar
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

    // 3. Xử lý cập nhật Thông tin (Sửa lỗi 405)
    const handleUpdateInfo = async (e) => {
        if (e) e.preventDefault(); // Chặn hành vi submit mặc định
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

    // 4. Xử lý đổi mật khẩu (Sửa lỗi thông báo sai)
    const handleChangePassword = async (e) => {
        if (e) e.preventDefault();

        if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
            alert("Xác nhận mật khẩu mới không khớp!");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:8000/api/profile/change-password', {
                method: 'PUT',
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
                // Hiển thị lỗi cụ thể từ Server (VD: "Mật khẩu cũ không đúng")
                alert(result.message || "Có lỗi xảy ra khi đổi mật khẩu.");
            }
        } catch (error) {
            alert("Lỗi kết nối mạng.");
        }
    };
    const fetchMyRecipes = async () => {
        setLoadingData(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:8000/api/my-recipes', {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const result = await res.json();
            if (res.ok) setMyRecipes(result.data);
        } catch (error) { console.error("Lỗi lấy công thức:", error); }
        setLoadingData(false);
    };

    // Hàm lấy danh sách Cookbook của tôi
    const fetchMyCookbooks = async () => {
        setLoadingData(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:8000/api/my-cookbooks', {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const result = await res.json();
            if (res.ok) setMyCookbooks(result.data);
        } catch (error) { console.error("Lỗi lấy cookbook:", error); }
        setLoadingData(false);
    };

    // Tự động gọi API khi chuyển tab
    useEffect(() => {
        if (activeTab === 'recipes') fetchMyRecipes();
        if (activeTab === 'cookbooks') fetchMyCookbooks();
    }, [activeTab]);

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div id="wrapper" className="d-flex">
            <Sidebar />
            <div id="page-content-wrapper" className="w-100 bg-light">
                <Navbar />
                <input type="file" ref={fileInputRef} onChange={handleAvatarChange} style={{ display: 'none' }} accept="image/*" />

                <div className="container mt-4 mb-5">
                    <div className="row justify-content-center">
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
                                    <button onClick={() => setActiveTab('info')} className={`list-group-item list-group-item-action py-3 border-0 ${activeTab === 'info' ? 'bg-light text-warning fw-bold' : ''}`}>
                                        <i className="bi bi-person me-2"></i> Thông tin cá nhân
                                    </button>
                                    <button onClick={() => setActiveTab('recipes')} className={`list-group-item list-group-item-action py-3 border-0 ${activeTab === 'recipes' ? 'bg-light text-warning fw-bold' : ''}`}>
                                        <i className="bi bi-journal-text me-2"></i> Công thức của tôi
                                    </button>
                                    <button onClick={() => setActiveTab('cookbooks')} className={`list-group-item list-group-item-action py-3 border-0 ${activeTab === 'cookbooks' ? 'bg-light text-warning fw-bold' : ''}`}>
                                        <i className="bi bi-book me-2"></i> Cookbook của tôi
                                    </button>
                                    <button onClick={() => setActiveTab('password')} className={`list-group-item list-group-item-action py-3 border-0 ${activeTab === 'password' ? 'bg-light text-warning fw-bold' : ''}`}>
                                        <i className="bi bi-shield-lock me-2"></i> Đổi mật khẩu
                                    </button>
                                    <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="list-group-item list-group-item-action py-3 border-0 text-danger fw-bold">
                                        <i className="bi bi-box-arrow-right me-2"></i> Đăng xuất
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-7">
                            <div className="card border-0 shadow-sm rounded-4 p-4 min-vh-50">
                                {activeTab === 'info' && (
                                    <>
                                        <h5 className="fw-bold mb-4">Cập nhật thông tin</h5>
                                        <form onSubmit={handleUpdateInfo} className="row g-3">
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
                                                <textarea
                                                    className="form-control"
                                                    rows="4"
                                                    value={infoForm.bio || ''} // Thêm || '' để tránh lỗi khi bio bị null
                                                    onChange={e => setInfoForm({ ...infoForm, bio: e.target.value })}
                                                    placeholder="Giới thiệu một chút về bạn..."
                                                ></textarea>
                                            </div>
                                            <div className="col-12 mt-4">
                                                <button type="submit" className="btn btn-warning text-white fw-bold px-4 rounded-3">
                                                    Lưu thay đổi
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                )}
                                {/* --- TAB: CÔNG THỨC --- */}
                                {activeTab === 'recipes' && (
                                    <>
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <h5 className="fw-bold mb-0">Công thức đã đăng</h5>
                                            <button className="btn btn-warning btn-sm text-white rounded-pill px-3" onClick={() => navigate('/create-recipe')}>
                                                + Thêm mới
                                            </button>
                                        </div>
                                        {loadingData ? <div className="text-center py-5"><div className="spinner-border text-warning"></div></div> : (
                                            <div className="row g-3">
                                                {myRecipes.length > 0 ? myRecipes.map(recipe => (
                                                    <div className="col-md-6" key={recipe.id}>
                                                        <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden recipe-card-mini">
                                                            <img src={`http://127.0.0.1:8000/storage/${recipe.image}`} className="card-img-top" style={{ height: '120px', objectFit: 'cover' }} alt={recipe.title} />
                                                            <div className="card-body p-2">
                                                                <h6 className="card-title mb-1 text-truncate">{recipe.title}</h6>
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <span className="badge bg-light text-dark small">{recipe.category?.name}</span>
                                                                    <button className="btn btn-link btn-sm text-primary p-0" onClick={() => navigate(`/edit-recipe/${recipe.id}`)}>Sửa</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )) : <div className="text-center py-5 text-muted">Bạn chưa đăng công thức nào.</div>}
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* --- TAB: COOKBOOK --- */}
                                {activeTab === 'cookbooks' && <MyCookbooks />}
                                {activeTab === 'password' && (
                                    <>
                                        <h5 className="fw-bold mb-4">Bảo mật tài khoản</h5>
                                        <form onSubmit={handleChangePassword} className="row g-3">
                                            <div className="col-12">
                                                <label className="form-label small fw-semibold">Mật khẩu hiện tại</label>
                                                <input type="password" required className="form-control"
                                                    value={passwordForm.old_password}
                                                    placeholder="********"
                                                    onChange={e => setPasswordForm({ ...passwordForm, old_password: e.target.value })} />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label small fw-semibold">Mật khẩu mới</label>
                                                <input type="password" required className="form-control"
                                                    value={passwordForm.new_password}
                                                    placeholder="Mật khẩu mới ít nhất 6 ký tự"
                                                    onChange={e => setPasswordForm({ ...passwordForm, new_password: e.target.value })} />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label small fw-semibold">Xác nhận mật khẩu mới</label>
                                                <input type="password" required className="form-control"
                                                    value={passwordForm.new_password_confirmation}
                                                    placeholder="Xác nhận mật khẩu mới"
                                                    onChange={e => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })} />
                                            </div>
                                            <div className="col-12 mt-4">
                                                <button type="submit" className="btn btn-primary fw-bold px-4 rounded-3">
                                                    Cập nhật mật khẩu
                                                </button>
                                            </div>
                                        </form>
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