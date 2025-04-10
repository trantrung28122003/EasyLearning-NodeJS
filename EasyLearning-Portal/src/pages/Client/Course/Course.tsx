import React, { useEffect, useState } from "react";
import {
  GET_ALL_CATEGORY_WITH_COURSE,
  GET_COURSE_BY_CATEGORY,
} from "../../../constants/API";
import { HTTP_OK } from "../../../constants/HTTPCode";
import { CategoryWithCourse } from "../../../model/Category";
import { DoCallAPIWithOutToken } from "../../../services/HttpService";
import ClientShared from "../Shared/ClientShared";
import { ApplicationResponse } from "../../../model/BaseResponse";
import Card from "../../../components/card/SquareCard";
import { useNavigate, useParams } from "react-router-dom";

const Course: React.FC = () => {
  const { categoryId } = useParams();
  const [categories, setCategories] = useState<CategoryWithCourse[]>([]);
  const [categoriesWithCourse, setCategoriesWithCourse] = useState<
    CategoryWithCourse[]
  >([]);

  const doCallGetAllCourseByCategory = () => {
    const URL = `${GET_COURSE_BY_CATEGORY + "/" + categoryId}`;
    DoCallAPIWithOutToken(URL, "get").then((res) => {
      if (res.status === HTTP_OK) {
        const response: ApplicationResponse<CategoryWithCourse[]> = res.data;
        const categoriesWithCourseData = Array.isArray(response.result)
          ? response.result
          : [response.result];
        setCategoriesWithCourse(categoriesWithCourseData);
      }
    });
  };

  const doCallGetAllCategory = () => {
    const URL = GET_ALL_CATEGORY_WITH_COURSE;
    DoCallAPIWithOutToken(URL, "get").then((res) => {
      if (res.status === HTTP_OK) {
        const response: ApplicationResponse<CategoryWithCourse[]> = res.data;
        const categoriesData = Array.isArray(response.result)
          ? response.result
          : [response.result];
        setCategories(categoriesData);
      }
    });
  };
  const navigate = useNavigate();
  const handleSearch = () => {
    navigate(`/courses/search`);
  };

  useEffect(() => {
    doCallGetAllCourseByCategory();
    doCallGetAllCategory();
  }, [categoryId]);

  return (
    <ClientShared>
      <div style={{ height: "100vh" }}>
        <div
          className="d-flex justify-content align-items-center mb-3"
          style={{ margin: "40px" }}
        >
          <div className="category-dropdown">
            <button className="category-link btn btn-primary btn-filter">
              Thể loại
            </button>

            <div className="category-menu">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={"/courses/" + category.id}
                  className="dropdown-item"
                >
                  {category.categoryName}
                </a>
              ))}
            </div>
          </div>

          <div className="input-group" style={{ marginLeft: "150px" }}>
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Đi đến trang tìm kiếm và bộ lọc"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <button className="btn btn-primary" onClick={handleSearch}>
              Đi đến <i className="fas fa-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
        <hr style={{ marginBottom: "80px" }} />
        <div className="container">
          {categoriesWithCourse.map((category, index) => {
            return (
              <div className="container-xxl" key={index}>
                <div className="container">
                  <div
                    className="text-center wow fadeInUp"
                    data-wow-delay="0.1s"
                  >
                    <h6 className="section-title bg-white text-center text-primary px-3">
                      Các Khóa Học
                    </h6>
                    <h1 className="mb-5">
                      {!category.courses || category.courses.length === 0
                        ? `Chưa có bất kì khóa học nào của ${category.categoryName} `
                        : `Các khóa Học của ${category.categoryName}`}
                    </h1>
                  </div>
                  <div className="row g-4 justify-content-center">
                    {category.courses.map((course, i) => {
                      return <Card course={course} key={i} />;
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ClientShared>
  );
};

export default Course;
