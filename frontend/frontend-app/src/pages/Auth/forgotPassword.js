import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/Css/login.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                // Hiển thị thông báo thành công từ server
                setMessage(data.message || 'Yêu cầu đã được gửi! Vui lòng kiểm tra email của bạn.');
            } else {
                // Xử lý lỗi (ví dụ: email không tồn tại)
                setError(data.message || 'Email không tồn tại trong hệ thống!');
            }
        } catch (err) {
            setError('Không thể kết nối đến máy chủ!');
        }
    };

    return (
        <div className="login-page-bg d-flex align-items-center justify-content-center">
            <div className="login-card shadow d-flex flex-column flex-md-row">

                {/* Cột trái: Giữ nguyên hình ảnh tròn để tạo trải nghiệm thông minh, đồng bộ [cite: 7] */}
                <div className="login-visual d-flex align-items-center justify-content-center p-4">
                    <div className="image-circle-container">
                        <img
                            src="https://bizweb.dktcdn.net/100/348/768/files/134972-4-nhom-chat-dinh-duong-cho-be.jpg?v=1680937503615"
                            alt="Food circle"
                            className="img-fluid food-circle"
                        />
                    </div>

                </div>

                {/* Cột phải: Form Quên mật khẩu */}
                <div className="login-form-area p-4 p-lg-5 position-relative">
                    {/* Nút quay lại login */}
                    <button onClick={() => navigate('/login')} className="back-btn-circle">
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
                        <h3 className="fw-bold mt-3">Quên mật khẩu</h3>
                        <p className="text-muted small">
                            Nhập email đã đăng ký của bạn để nhận hướng dẫn đặt lại mật khẩu.
                        </p>
                    </div>

                    {message && <div className="alert alert-success py-2 small">{message}</div>}
                    {error && <div className="alert alert-danger py-2 small">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label small fw-bold text-muted">Địa chỉ Email</label>
                            <input
                                type="email"
                                className="form-control bg-light border-0 py-2"
                                placeholder="name@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-success-custom w-100 py-2 fw-bold text-uppercase">
                            Gửi yêu cầu
                        </button>

                        <div className="text-center mt-4">
                            <span
                                className="small fw-bold text-dark cursor-pointer"
                                onClick={() => navigate('/login')}
                                style={{ cursor: 'pointer' }}
                            >
                                Quay lại trang Đăng nhập
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;