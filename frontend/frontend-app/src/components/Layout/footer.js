import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-top pt-5 pb-3 bg-white mt-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-12 mb-4">
            <h5 className="fw-bold mb-3 text-danger">Bếp Việt 4.0</h5>
            <p className="text-muted small mb-4">
              Nơi lan tỏa niềm đam mê nấu nướng. Kết nối hàng triệu bếp ăn gia đình trên khắp Việt Nam.
            </p>
            <div className="d-flex mb-4">
              <a href="#" className="social-btn"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="social-btn"><i className="fa-brands fa-youtube"></i></a>
              <a href="#" className="social-btn"><i className="fa-brands fa-tiktok"></i></a>
            </div>
          </div>
          <div className="col-6 col-lg-2 col-md-4 mb-4">
            <h6 className="fw-bold mb-3">Khám phá</h6>
            <ul className="list-unstyled">
              <li><Link to="/new" className="footer-link">Món mới</Link></li>
              <li><Link to="/inspiration" className="footer-link">Cảm hứng</Link></li>
              <li><Link to="/blog" className="footer-link">Blog</Link></li>
            </ul>
          </div>
          <div className="col-6 col-lg-2 col-md-4 mb-4">
            <h6 className="fw-bold mb-3">Công ty</h6>
            <ul className="list-unstyled">
              <li><Link to="/about" className="footer-link">Giới thiệu</Link></li>
              <li><Link to="/contact" className="footer-link">Liên hệ</Link></li>
              <li><Link to="/privacy" className="footer-link">Bảo mật</Link></li>
            </ul>
          </div>
        </div>
        <hr className="my-4 text-muted" />
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <span className="text-muted small">
              &copy; 2024 Bếp Việt 4.0. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;