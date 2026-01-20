import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/css/login.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const url = isLogin
            ? 'http://127.0.0.1:8000/api/login'
            : 'http://127.0.0.1:8000/api/register';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                if (data.access_token) {
                    localStorage.setItem('token', data.access_token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    alert(isLogin ? 'Đăng nhập thành công!' : 'Đăng ký thành công!');

                    // Sử dụng window.location để refresh app, giúp Navbar nhận trạng thái mới
                    window.location.href = '/blog/1';
                }
            } else {
                // Xử lý lỗi validation (422) hoặc lỗi khác
                if (response.status === 422 && data.errors) {
                    const firstError = Object.values(data.errors).flat()[0];
                    setError(firstError);
                } else {
                    setError(data.message || 'Tên đăng nhập hoặc mật khẩu không đúng!');
                }
            }
        } catch (err) {
            setError('Không thể kết nối đến máy chủ!');
        }
    };

    return (
        <div className="login-page-bg d-flex align-items-center justify-content-center">
            <div className="login-card shadow d-flex flex-column flex-md-row">
                {/* Cột trái: Hình ảnh */}
                <div className="login-visual d-flex align-items-center justify-content-center p-4">
                    <div className="image-circle-container">
                        <img
                            src="https://bizweb.dktcdn.net/100/348/768/files/134972-4-nhom-chat-dinh-duong-cho-be.jpg?v=1680937503615"
                            alt="Food circle"
                            className="img-fluid food-circle"
                        />
                    </div>
                </div>

                {/* Cột phải: Form */}
                <div className="login-form-area p-4 p-lg-5 position-relative">
                    <button onClick={() => navigate('/')} className="back-btn-circle">
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>

                    <div className="text-center mb-4">
                        <div className="mx-auto mb-3" style={{ width: '120px' }}>
                            <img
                                src="/img/logo.png"
                                alt="Bếp Việt 4.0"
                                className="img-fluid"
                                style={{ maxHeight: '80px', objectFit: 'contain' }}
                            />
                        </div>

                        <div className="auth-tabs d-flex justify-content-center gap-4 border-bottom">
                            <button
                                className={`tab-btn ${isLogin ? 'active' : ''}`}
                                onClick={() => { setIsLogin(true); setError(''); }}
                            >
                                Đăng nhập
                            </button>
                            <button
                                className={`tab-btn ${!isLogin ? 'active' : ''}`}
                                onClick={() => { setIsLogin(false); setError(''); }}
                            >
                                Đăng ký
                            </button>
                        </div>
                    </div>

                    {error && <div className="alert alert-danger py-2 small">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        {isLogin && (
                            <>
                                <div className="d-grid gap-2 mb-3">
                                    <button type="button" className="btn btn-outline-dark fw-bold py-2 border-secondary">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" width="18" className="me-3" alt="google" />
                                        Google
                                    </button>
                                </div>
                                <div className="divider-text mb-4"><span>hoặc bằng tên đăng nhập</span></div>
                            </>
                        )}

                        {!isLogin && (
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">Email</label>
                                <input type="email" name="email" className="form-control bg-light" placeholder="name@gmail.com" onChange={handleChange} required />
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="form-label small fw-bold text-muted">Tên đăng nhập</label>
                            <input type="text" name="username" className="form-control bg-light border-0 py-2" placeholder="Tên đăng nhập" onChange={handleChange} required />
                        </div>

                        <div className="mb-4">
                            <div className="d-flex justify-content-between">
                                <label className="form-label small fw-bold text-muted">Mật khẩu</label>
                                {isLogin && <Link to="/forgotPassword" house className="small text-muted text-decoration-none">Quên Mật khẩu?</Link>}
                            </div>
                            <input type="password" name="password" className="form-control bg-light border-0 py-2" placeholder="********" onChange={handleChange} required />
                        </div>

                        {!isLogin && (
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted">Xác nhận mật khẩu</label>
                                <input type="password" name="password_confirmation" className="form-control bg-light border-0 py-2" placeholder="********" onChange={handleChange} required />
                            </div>
                        )}

                        <button type="submit" className="btn btn-success-custom w-100 py-2 fw-bold text-uppercase">
                            {isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;