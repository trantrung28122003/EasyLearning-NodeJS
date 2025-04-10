import ClientShared from "../Shared/ClientShared";

const About = () => {
  return (
    <>
      <ClientShared>
      <div className="container-xxl py-5">
          <div className="container">
            <div className="row g-4">
              <div
                className="col-lg-3 col-sm-6 wow fadeInUp"
                data-wow-delay="0.1s"
              >
                <div className="service-item text-center pt-3">
                  <div className="p-4">
                    <i className="fa fa-3x fa-graduation-cap text-primary mb-4"></i>
                    <h5 className="mb-3">Giảng Viên Chuyên Nghiệp</h5>
                    <p>
                      Phơng pháp giảng dạy linh hoạt và có kinh nghiệm trong lĩnh vực chuyên môn
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-3 col-sm-6 wow fadeInUp"
                data-wow-delay="0.3s"
              >
                <div className="service-item text-center pt-3">
                  <div className="p-4">
                    <i className="fa fa-3x fa-globe text-primary mb-4"></i>
                    <h5 className="mb-3">Đăng Ký Trực Tuyến</h5>
                    <p>
                    Thuận tiện cho việc đăng ký, lựa chọn thời gian và lịch học phù hợp với lịch trình cá nhân. 
                    Bạn có thể theo dõi và quản lý các khóa học đã đăng ký một cách dễ dàng. 
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-3 col-sm-6 wow fadeInUp"
                data-wow-delay="0.5s"
              >
                <div className="service-item text-center pt-3">
                  <div className="p-4">
                    <i className="fa fa-3x fa-home text-primary mb-4"></i>
                    <h5 className="mb-3">Các Dự Án Tại Nhà</h5>
                    <p>
                    Không bị giới hạn bởi môi trường làm việc truyền thống, có thể chọn thời gian làm việc phù hợp với lịch trình cá nhân và tạo điều kiện tốt nhất để sáng tạo. 
                    Hãy phát huy tối đa khả năng của bạn từ không gian quen thuộc!
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-3 col-sm-6 wow fadeInUp"
                data-wow-delay="0.7s"
              >
                <div className="service-item text-center pt-3">
                  <div className="p-4">
                    <i className="fa fa-3x fa-book-open text-primary mb-4"></i>
                    <h5 className="mb-3">Thư Viện Tài Liệu</h5>
                    <p>
                    Cung cấp một loạt các tài liệu và tài nguyên khác nhau, từ sách, bài báo, đến bản ghi và hướng dẫn, giúp bạn nắm vững thông tin cần thiết cho dự án của mình. 
                    Chúng tôi cam kết hỗ trợ bạn trong suốt quá trình học tập và phát triển bền vững, tạo ra giá trị thiết thực và lâu dài!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-xxl py-5">
          <div className="container">
            <div className="row g-5">
              <div
                className="col-lg-6 wow fadeInUp"
                data-wow-delay="0.1s"
                style={{ minHeight: "400px" }}
              >
                <div className="position-relative h-100">
                  <img
                    className="img-fluid position-absolute w-100 h-100"
                    src="https://image.freepik.com/free-photo/girl-reading-in-library_23-2147617630.jpg"
                    alt=""
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
              <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
                <h6 className="section-title bg-white text-start text-primary pe-3">
                  Về Chúng Tôi
                </h6>
                <h1 className="mb-4">Chào mừng đến với eLEARNING</h1>
                <p className="mb-4">
                  Tại eLEARNING , chúng tôi tin rằng học tập không bao giờ ngừng
                  lại và mỗi người đều có khả năng phát triển bản thân. Chính vì
                  vậy, chúng tôi đã thành lập eLEARNING với mục tiêu giúp mọi
                  người tiếp cận kiến thức và kỹ năng mới một cách dễ dàng và
                  linh hoạt.
                </p>
                <p className="mb-4">
                  Hãy đồng hành cùng chúng tôi trên con đường phát triển cá nhân
                  và chuyên môn của bạn. Đăng ký ngay hôm nay để bắt đầu hành
                  trình mới của bạn!
                </p>
                <div className="row gy-2 gx-4 mb-4">
                  <div className="col-sm-6">
                    <p className="mb-0">
                      <i className="fa fa-arrow-right text-primary me-2"></i>
                      Giảng Viên Chuyên Nghiệp
                    </p>
                  </div>
                  <div className="col-sm-6">
                    <p className="mb-0">
                      <i className="fa fa-arrow-right text-primary me-2"></i>
                      Đăng Ký Học Trực Tuyến
                    </p>
                  </div>
                  <div className="col-sm-6">
                    <p className="mb-0">
                      <i className="fa fa-arrow-right text-primary me-2"></i>Cấp
                      Giấy Chứng Nhận Quốc Tế
                    </p>
                  </div>
                  <div className="col-sm-6">
                    <p className="mb-0">
                      <i className="fa fa-arrow-right text-primary me-2"></i>
                      Thực Hiện Dự Án Tại Nhà
                    </p>
                  </div>
                  <div className="col-sm-6">
                    <p className="mb-0">
                      <i className="fa fa-arrow-right text-primary me-2"></i>
                      Tiết Kiệm Chi{" "}
                    </p>
                  </div>
                  <div className="col-sm-6">
                    <p className="mb-0">
                      <i className="fa fa-arrow-right text-primary me-2"></i>
                      Thời Gian Linh Hoạt
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-xxl py-5">
          <div className="container">
            <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
              <h6 className="section-title bg-white text-center text-primary px-3">
                Giảng Viên
              </h6>
              <h1 className="mb-5">Các Giảng Viên</h1>
            </div>
            <div className="row g-4">
              <div
                className="col-lg-3 col-md-6 wow fadeInUp"
                data-wow-delay="0.1s"
              >
                <div className="team-item bg-light">
                  <div className="overflow-hidden">
                    <img
                      src="https://th.bing.com/th/id/OIP.IGNf7GuQaCqz_RPq5wCkPgAAAA?rs=1&pid=ImgDetMain"
                      height="400"
                      width="300"
                      alt=""
                    />
                  </div>
                  <div
                    className="position-relative d-flex justify-content-center"
                    style={{ marginTop: "-23px" }}
                  >
                    <div className="bg-light d-flex justify-content-center pt-2 px-1">
                      <a className="btn btn-sm-square btn-primary mx-1" href="">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                      <a className="btn btn-sm-square btn-primary mx-1" href="">
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a className="btn btn-sm-square btn-primary mx-1" href="">
                        <i className="fab fa-instagram"></i>
                      </a>
                    </div>
                  </div>
                  <div className="text-center p-4">
                    <h5 className="mb-0">Trần Quốc Trung</h5>
                    <small>Dạo diễn kiêm diễn viên</small>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-3 col-md-6 wow fadeInUp"
                data-wow-delay="0.3s"
              >
                <div className="team-item bg-light">
                  <div className="overflow-hidden">
                    <img
                      src="https://cdn2.f-cdn.com/files/download/40990929/88eaef.jpg"
                      height="400"
                      width="300"
                      alt=""
                    />
                  </div>
                  <div
                    className="position-relative d-flex justify-content-center"
                    style={{ marginTop: "-23px" }}
                  >
                    <div className="bg-light d-flex justify-content-center pt-2 px-1">
                      <a className="btn btn-sm-square btn-primary mx-1" href="">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                      <a className="btn btn-sm-square btn-primary mx-1" href="">
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a className="btn btn-sm-square btn-primary mx-1" href="">
                        <i className="fab fa-instagram"></i>
                      </a>
                    </div>
                  </div>
                  <div className="text-center p-4">
                    <h5 className="mb-0">Đặng Ngọc Sơn</h5>
                    <small>Giảng viên thanh nhạc</small>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-3 col-md-6 wow fadeInUp"
                data-wow-delay="0.5s"
              >
                <div className="team-item bg-light">
                  <div className="overflow-hidden">
                    <img
                      src="https://th.bing.com/th/id/OIP.jk-VSpVzp61csX9cGu3m7wHaKf?rs=1&pid=ImgDetMain"
                      alt=""
                      height="400"
                      width="300"
                    />
                  </div>
                  <div
                    className="position-relative d-flex justify-content-center"
                    style={{ marginTop: "-23px" }}
                  >
                    <div className="bg-light d-flex justify-content-center pt-2 px-1">
                      <a className="btn btn-sm-square btn-primary mx-1" href="">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                      <a className="btn btn-sm-square btn-primary mx-1" href="">
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a className="btn btn-sm-square btn-primary mx-1" href="">
                        <i className="fab fa-instagram"></i>
                      </a>
                    </div>
                  </div>
                  <div className="text-center p-4">
                    <h5 className="mb-0">Trần Thị Mỹ Tuyến</h5>
                    <small>Giảng viên tiếng anh</small>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-3 col-md-6 wow fadeInUp"
                data-wow-delay="0.7s"
              >
                <div className="team-item bg-light">
                  <div className="overflow-hidden">
                    <img
                      src="https://f.hubspotusercontent20.net/hubfs/11621/Alice%20Harmon_RESIZED.png"
                      height="400"
                      width="300"
                      alt=""
                    />
                  </div>
                  <div
                    className="position-relative d-flex justify-content-center"
                    style={{ marginTop: "-23px" }}
                  >
                    <div className="bg-light d-flex justify-content-center pt-2 px-1">
                      <a className="btn btn-sm-square btn-primary mx-1" href="">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                      <a className="btn btn-sm-square btn-primary mx-1" href="">
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a className="btn btn-sm-square btn-primary mx-1" href="">
                        <i className="fab fa-instagram"></i>
                      </a>
                    </div>
                  </div>
                  <div className="text-center p-4">
                    <h5 className="mb-0">Nguyễn Vũ Hoàng Diệp</h5>
                    <small>Ký sư phần mềm</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-xxl py-5 bg-light">
          <div className="container">
            <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
              <h6 className="section-title text-center text-primary px-3">
                Điều Khoản Và Chính Sách
              </h6>
              <h1 className="mb-5">Chính Sách Của Chúng Tôi</h1>
            </div>
            <div className="row g-4">
              <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
                <h5 className="text-primary mb-3">
                  1. Quyền và Nghĩa vụ của Người Dùng
                </h5>
                <p>
                  Khi đăng ký và sử dụng dịch vụ của chúng tôi, bạn cần cung cấp
                  thông tin chính xác và tuân thủ các quy định về việc sử dụng
                  nền tảng.
                </p>
              </div>
              <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
                <h5 className="text-primary mb-3">2. Chính Sách Bảo Mật</h5>
                <p>
                  Thông tin cá nhân của bạn sẽ được bảo mật và chỉ sử dụng cho
                  các mục đích liên quan đến việc cung cấp dịch vụ.
                </p>
              </div>
              <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.5s">
                <h5 className="text-primary mb-3">3. Chính Sách Hoàn Tiền</h5>
                <p>
                  Chúng tôi có chính sách hoàn tiền nếu bạn không hài lòng với
                  dịch vụ trong vòng 7 ngày kể từ ngày đăng ký.
                </p>
              </div>
              <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.5s">
                <h5 className="text-primary mb-3">4. Điều Khoản Sử Dụng</h5>
                <p>
                  Bạn không được phép sử dụng nền tảng cho các mục đích bất hợp
                  pháp hoặc vi phạm quyền lợi của người khác.
                </p>
              </div>
            </div>
            <div className="text-center mt-4">
              <a href="/terms" className="btn btn-primary px-4 py-2">
                Xem Chi Tiết Điều Khoản
              </a>
            </div>
          </div>
        </div>
      </ClientShared>
    </>
  );
};

export default About;
