import React from "react";
import imgcourse1 from "../../assets/img/course-1.jpg";
import imgcourse2 from "../../assets/img/course-2.jpg";
import imgcourse3 from "../../assets/img/course-3.jpg";
const Footer: React.FC = () => {
  return (
    <div className="container-fluid bg-dark text-light footer pt-5  wow fadeIn">
      <div className="container py-5">
        <div className="row g-5">
          <div className="col-lg-3 col-md-6">
            <h4 className="text-white mb-3">Liên Kết Nhanh</h4>
            <a className="btn btn-link" href="">
              Thông Tin
            </a>
            <a className="btn btn-link" href="">
              Liên Hệ
            </a>
            <a className="btn btn-link" href="">
              Chính Sách Bảo Mật
            </a>
            <a className="btn btn-link" href="">
              Điều khoản và Điều kiện
            </a>
            <a className="btn btn-link" href="">
              Câu hỏi thường gặp và Trợ giúp
            </a>
          </div>
          <div className="col-lg-3 col-md-6">
            <h4 className="text-white mb-3">Thông Tin Liên Hệ</h4>
            <p className="mb-2">
              <i className="fa fa-map-marker-alt me-3"></i>
              Thôn Sao Mai - xã Ka Đơn - huyện Đơn Dương - tỉnh Lâm Đồng
            </p>
            <p className="mb-2">
              <i className="fa fa-phone-alt me-3"></i>
              +84 123 456 789
            </p>
            <p className="mb-2">
              <i className="fa fa-envelope me-3"></i>
              eLEARNING@gmail.com
            </p>
            <div className="d-flex pt-2">
              <a className="btn btn-outline-light btn-social" href="">
                <i className="fab fa-twitter"></i>
              </a>
              <a className="btn btn-outline-light btn-social" href="">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a className="btn btn-outline-light btn-social" href="">
                <i className="fab fa-youtube"></i>
              </a>
              <a className="btn btn-outline-light btn-social" href="">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <h4 className="text-white mb-3">Bộ sưu tập</h4>
            <div className="row g-2 pt-2">
              <div className="col-4">
                <img
                  className="img-fluid bg-light p-1"
                  src={imgcourse1}
                  alt=""
                />
              </div>
              <div className="col-4">
                <img
                  className="img-fluid bg-light p-1"
                  src={imgcourse2}
                  alt=""
                />
              </div>
              <div className="col-4">
                <img
                  className="img-fluid bg-light p-1"
                  src={imgcourse3}
                  alt=""
                />
              </div>
              <div className="col-4">
                <img
                  className="img-fluid bg-light p-1"
                  src={imgcourse2}
                  alt=""
                />
              </div>
              <div className="col-4">
                <img
                  className="img-fluid bg-light p-1"
                  src={imgcourse3}
                  alt=""
                />
              </div>
              <div className="col-4">
                <img
                  className="img-fluid bg-light p-1"
                  src={imgcourse1}
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <h4 className="text-white mb-3">Thông Báo</h4>
            <p>
              Cung cấp thông tin liên lạc để nhận được thông báo mới nhất của
              chúng tôi
            </p>
            <div
              className="position-relative mx-auto"
              style={{ maxWidth: "400px" }}
            >
              <input
                className="form-control border-0 w-100 py-3 ps-4 pe-5"
                type="text"
                placeholder="Email"
              />
              <button
                type="button"
                className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="copyright">
          <div className="row">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              &copy;{" "}
              <a className="border-bottom" href="#">
                eLEARNING
              </a>{" "}
              code bởi
              <a className="border-bottom" href="https://htmlcodex.com">
                {" "}
                Trung đẹp trai
              </a>
              <br />
              <br />
            </div>
            <div className="col-md-6 text-center text-md-end">
              <div className="footer-menu">
                <a href="">Trang Chủ</a>
                <a href="">Trợ Giúp</a>
                <a href="">Câu hỏi thường gặp</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
