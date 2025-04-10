import React, { useEffect, useState } from "react";
import styled from "./Home.module.css";
import ClientShared from "../Shared/ClientShared";

import Cat1Img from "../../../assets/img/cat-1.jpg";
import Cat2Img from "../../../assets/img/cat-2.jpg";
import Cat3Img from "../../../assets/img/cat-3.jpg";
import Cat4Img from "../../../assets/img/cat-4.jpg";
import { DoCallAPIWithOutToken } from "../../../services/HttpService";
import { HTTP_OK } from "../../../constants/HTTPCode";
import {
  GET_ALL_COURSE,
  GET_COURSES_MOST_REGISTERED,
  GET_FEEDBACKS_WITH_FIVE_RATING,
  GET_TOP_FOUR_MOST_CATEGORY,
} from "../../../constants/API";
import { ApplicationResponse } from "../../../model/BaseResponse";
import Card from "../../../components/card/SquareCard";
import { Course } from "../../../model/Course";
import { Feedback } from "../../../model/FeedBack";
import { Category } from "../../../model/Category";
import OwlCarousel from "react-owl-carousel";
import SearchCard from "../../../components/card/LongCard";

const Home: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const doGetCourses = () => {
    DoCallAPIWithOutToken(GET_ALL_COURSE, "get").then((res) => {
      if (res.status === HTTP_OK) {
        const data: ApplicationResponse<Course[]> = res.data;
        setCourses(data.result);
      }
    });
  };

  const doGetTopMostCategory = () => {
    DoCallAPIWithOutToken(GET_TOP_FOUR_MOST_CATEGORY, "get").then(
      (response) => {
        if (response.status === HTTP_OK) {
          const data: ApplicationResponse<Category[]> = response.data;
          setCategories(data.result);
        }
      }
    );
  };

  const doGetFeedBackWithFiveRating = () => {
    DoCallAPIWithOutToken(GET_FEEDBACKS_WITH_FIVE_RATING, "get").then(
      (response) => {
        if (response.status === HTTP_OK) {
          const data: ApplicationResponse<Feedback[]> = response.data;
          setFeedbacks(data.result);
        }
      }
    );
  };

  // const feedbacks: Feedback[] = [];
  // courses.forEach((course) => {
  //   feedbacks.concat(course.feedbacks);
  // });

  useEffect(() => {
    doGetCourses();
    doGetTopMostCategory();
    doGetFeedBackWithFiveRating();
  }, []);

  return (
    <ClientShared>
      <div>
        <div className="container-fluid p-0">
          <div className="header-carousel position-relative">
            <div className="owl-carousel-item position-relative">
              <img
                className="img-fluid"
                src="https://easylearning.blob.core.windows.net/images-videos/carousel.jpg"
                alt=""
                style={{ width: "100%" }}
              />
              <div
                className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center"
                style={{ background: "rgba(24, 29, 56, .7)" }}
              >
                <div className="container">
                  <div className="row justify-content-start">
                    <div className="col-sm-10 col-lg-8">
                      <h5 className="text-primary text-uppercase mb-3 animated slideInDown">
                        Các Khóa Học Tốt Nhất
                      </h5>
                      <h1 className="display-3 text-white animated slideInDown">
                        Nền Tảng Bán Khóa Học Tốt Nhất Hiện Nay
                      </h1>
                      <a
                        href="/about"
                        className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft"
                      >
                        Xem Thêm
                      </a>
                      <a
                        href="/courses/search"
                        className="btn btn-light py-md-3 px-md-5 animated slideInRight"
                      >
                        Tham Gia Ngay
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-xxl py-5 category">
          <div className="container">
            <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
              <h6 className="section-title bg-white text-center text-primary px-3">
                Danh Mục
              </h6>
              <h1 className="mb-5">Các Danh Mục Có Nhiều Khóa Học</h1>
            </div>
            <div className="row g-3">
              <div className="col-lg-7 col-md-6">
                <div className="row g-3">
                  {categories[0] && (
                    <div
                      className="col-lg-12 col-md-12 wow zoomIn"
                      data-wow-delay="0.1s"
                    >
                      <a
                        className="position-relative d-block overflow-hidden"
                        href={"/courses/" + categories[0].id}
                      >
                        <img className="img-fluid" src={Cat1Img} alt="" />
                        <div
                          className="bg-white text-center position-absolute bottom-0 end-0 py-2 px-3"
                          style={{ margin: "1px" }}
                        >
                          <h5 className="m-0">{categories[0].categoryName}</h5>
                          <small className="text-primary">
                            {categories[0].coursesDetails?.length || 0} Khóa học
                          </small>
                        </div>
                      </a>
                    </div>
                  )}
                  {categories[1] && (
                    <div
                      className="col-lg-6 col-md-12 wow zoomIn"
                      data-wow-delay="0.3s"
                    >
                      <a
                        className="position-relative d-block overflow-hidden"
                        href={"/courses/" + categories[1].id}
                      >
                        <img className="img-fluid" src={Cat2Img} alt="" />
                        <div
                          className="bg-white text-center position-absolute bottom-0 end-0 py-2 px-3"
                          style={{ margin: "1px" }}
                        >
                          <h5 className="m-0">{categories[1].categoryName}</h5>
                          <small className="text-primary">
                            {categories[1].coursesDetails?.length || 0} Khóa học
                          </small>
                        </div>
                      </a>
                    </div>
                  )}
                  {categories[2] && (
                    <div
                      className="col-lg-6 col-md-12 wow zoomIn"
                      data-wow-delay="0.5s"
                    >
                      <a
                        className="position-relative d-block overflow-hidden"
                        href={"/courses/" + categories[2].id}
                      >
                        <img className="img-fluid" src={Cat3Img} alt="" />
                        <div
                          className="bg-white text-center position-absolute bottom-0 end-0 py-2 px-3"
                          style={{ margin: "1px" }}
                        >
                          <h5 className="m-0">{categories[2].categoryName}</h5>
                          <small className="text-primary">
                            {categories[2].coursesDetails?.length || 0} Khóa học
                          </small>
                        </div>
                      </a>
                    </div>
                  )}
                </div>
              </div>
              {categories[3] && (
                <div
                  className="col-lg-5 col-md-6 wow zoomIn"
                  data-wow-delay="0.7s"
                  style={{ minHeight: "350px" }}
                >
                  <a
                    className="position-relative d-block h-100 overflow-hidden"
                    href={"/courses/" + categories[3].id}
                  >
                    <img
                      className="img-fluid position-absolute w-100 h-100"
                      src={Cat4Img}
                      alt=""
                      style={{ objectFit: "cover" }}
                    />
                    <div
                      className="bg-white text-center position-absolute bottom-0 end-0 py-2 px-3"
                      style={{ margin: "1px" }}
                    >
                      <h5 className="m-0">{categories[3].categoryName}</h5>
                      <small className="text-primary">
                        {categories[3].coursesDetails?.length || 0} Khóa học
                      </small>
                    </div>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container-xxl py-5">
          <div className="container">
            <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
              <h6 className="section-title bg-white text-center text-primary px-3">
                Các Khóa Học
              </h6>
              <h1 className="mb-5">Các Khóa Học Nổi Tiếng</h1>
            </div>
            <div className="row g-4 justify-content-center">
              {courses.map((course, index: number) => {
                return <Card course={course} key={index} />;
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">
              Các Khóa Học
            </h6>
            <h1 className="mb-5">Các Khóa Học Đang có giảm giá</h1>
          </div>
          <div className="row g-4 justify-content-center">
            {courses.map((course, index: number) => {
              return <SearchCard course={course} key={index} />;
            })}
          </div>
        </div>
      </div>

      <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
        <div className="container">
          <div className="text-center">
            <h6 className="section-title bg-white text-center text-primary px-3">
              Phản Hồi
            </h6>
            <h1 className="mb-5">Đánh Giá Từ Các Học Viên</h1>
          </div>
          <OwlCarousel
            className="owl-carousel testimonial-carousel position-relative"
            margin={20}
            autoPlay
            dotData
          >
            {feedbacks.map((feeback, index) => (
              <div className="testimonial-item text-center" key={index}>
                <img
                  className="border rounded-circle p-2 mx-auto mb-3"
                  src={feeback.avatar}
                  style={{ width: "80px", height: "80px" }}
                />
                <h5 className="mb-0">{feeback.fullNameUser}</h5>
                <p>Học viên</p>
                <div className="testimonial-text bg-light text-center p-4">
                  <p className="mb-0">{feeback.content}</p>
                </div>
              </div>
            ))}
          </OwlCarousel>
        </div>
      </div>
    </ClientShared>
  );
};

export default Home;
