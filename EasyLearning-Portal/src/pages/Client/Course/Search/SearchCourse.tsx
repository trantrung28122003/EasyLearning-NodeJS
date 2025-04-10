import React, { useEffect, useState } from "react";
import "./SearchCourse.css";
import ClientShared from "../../Shared/ClientShared";
import { Course } from "../../../../model/Course";
import {
  GET_ALL_CATEGORY_WITH_COURSE,
  GET_ALL_COURSE,
  SEARCH_COURSES,
} from "../../../../constants/API";
import { DoCallAPIWithOutToken } from "../../../../services/HttpService";
import { HTTP_OK } from "../../../../constants/HTTPCode";
import { ApplicationResponse } from "../../../../model/BaseResponse";
import SearchCard from "../../../../components/card/LongCard";
import { CategoryWithCourse } from "../../../../model/Category";
import DataLoader from "../../../../components/lazyLoadComponent/DataLoader";

const SearchCourse: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CategoryWithCourse[]>([]);
  const [query, setQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [courseType, setCourseType] = useState<string>("");
  const [rating, setRating] = useState<string>("");
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isRatingsOpen, setIsRatingsOpen] = useState(true);
  const [isLanguageOpen, setIsLanguageOpen] = useState(true);
  const [isSortByOpen, setIsSortByOpen] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const doCallGetAllCourse = () => {
    setIsLoading(true);
    const URL = GET_ALL_COURSE;
    DoCallAPIWithOutToken(URL, "get")
      .then((res) => {
        if (res.status === HTTP_OK) {
          const response: ApplicationResponse<Course[]> = res.data;
          setCourses(response.result);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const doCallGetAllCourseByCategory = () => {
    const URL = GET_ALL_CATEGORY_WITH_COURSE;
    setIsLoading(true);
    DoCallAPIWithOutToken(URL, "get")
      .then((res) => {
        if (res.status === HTTP_OK) {
          const response: ApplicationResponse<CategoryWithCourse[]> = res.data;
          const categoriesData = Array.isArray(response.result)
            ? response.result
            : [response.result];
          setCategories(categoriesData);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const doCallSearchCourses = (
    query: string,
    sortBy: string,
    courseType: string,
    rating: string
  ) => {
    const URL = `${SEARCH_COURSES}?query=${query}&sortBy=${sortBy}&courseType=${courseType}&rating=${rating}`;
    DoCallAPIWithOutToken(URL, "get").then((res) => {
      if (res.status === HTTP_OK) {
        const response = res.data;
        setCourses(response.result);
      }
    });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    doCallSearchCourses(query, value, courseType, rating);
    setIsFilterApplied(true);
  };

  const handleCourseTypeChange = (value: string) => {
    setCourseType(value);
    doCallSearchCourses(query, sortBy, value, rating);
    setIsFilterApplied(true);
  };

  const clearFilters = () => {
    setQuery("");
    setSortBy("");
    setCourseType("");
    setRating("");
    setIsFilterApplied(false);
    doCallSearchCourses("", "", "", "");
  };

  const itemsPerPage = 5;
  const totalPages = Math.ceil(courses.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const visiblePages = 2;

  const handleClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  };

  const getPages = () => {
    const pages: (number | string)[] = [];
    pages.push(1);

    // Thêm dấu "..." nếu có nhiều trang trước và sau trang hiện tại
    if (currentPage > visiblePages + 1) {
      pages.push("...");
    }
    // Thêm các trang gần trang hiện tại (ở giữa)
    for (
      let i = Math.max(currentPage - visiblePages, 2);
      i <= Math.min(currentPage + visiblePages, totalPages - 1);
      i++
    ) {
      pages.push(i);
    }

    // Thêm dấu "..." nếu có nhiều trang sau trang hiện tại
    if (currentPage < totalPages - visiblePages) {
      pages.push("...");
    }

    // Thêm trang cuối cùng
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    return pages;
  };

  // Lấy các sản phẩm cho trang hiện tại
  const currentCourses = courses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleRatings = () => setIsRatingsOpen(!isRatingsOpen);
  const toggleLanguage = () => setIsLanguageOpen(!isLanguageOpen);
  const toggleSortBy = () => setIsSortByOpen(!isSortByOpen);

  const handleSearch = () => {
    doCallSearchCourses(query, sortBy, courseType, rating);
    setIsSearching(true);
    setIsFilterApplied(!!(query || sortBy || courseType || rating));
  };
  useEffect(() => {
    doCallGetAllCourse();
    doCallGetAllCourseByCategory();
    setIsFilterApplied(!!(query || sortBy || courseType || rating));
  }, []);
  return (
    <ClientShared>
      <DataLoader isLoading={isLoading} />
      <div
        className="container-search-course"
        style={{ marginBottom: "80px", padding: "14px" }}
      >
        <div className="d-flex justify-content align-items-center mb-3">
          <div className="category-dropdown">
            <button
              className="category-link btn btn-primary btn-filter"
              style={{ marginRight: "20px" }}
            >
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

          <div className="input-group" style={{ marginLeft: "auto" }}>
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm khóa học bất kì"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <button className="btn btn-primary" onClick={handleSearch}>
              Tìm kiếm
            </button>
          </div>
        </div>
        <hr style={{ marginBottom: "50px" }} />
        {isSearching && query && (
          <div className="mb-3">
            {" "}
            <strong style={{ fontSize: "30px" }}>
              {courses.length} kết quả từ “{query}”{" "}
            </strong>{" "}
          </div>
        )}
        <div className="mb-3 d-flex justify-content align-items-center">
          <button
            className="btn btn-primary btn-filter"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            {isFilterOpen ? "Thu bộ lọc" : "Hiện thêm bộ lọc"}
          </button>
          {isFilterApplied && (
            <button
              className="btn-filter-clear"
              style={{ marginLeft: "12px" }}
              onClick={clearFilters}
            >
              Xóa bộ lọc
            </button>
          )}
          <div style={{ marginLeft: "auto" }}>
            {" "}
            <strong style={{ fontSize: "18px", color: "#6a6f73" }}>
              {courses.length} kết quả
            </strong>
          </div>
        </div>

        <div className="row">
          {isFilterOpen && (
            <div className="col-md-3">
              <div className="filter-section">
                <div className="filter-item">
                  <div className="filter-header" onClick={toggleSortBy}>
                    <h5>Sắp xếp theo</h5>
                    <i
                      className={`fas ${
                        isSortByOpen ? "fa-chevron-up" : "fa-chevron-down"
                      }`}
                    ></i>
                  </div>
                  {isSortByOpen && (
                    <div className="filter-content">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="a-to-z"
                          name="sort"
                          checked={sortBy == "az"}
                          onChange={() => handleSortChange("az")}
                        />
                        <label className="form-check-label" htmlFor="a-to-z">
                          Từ A đến Z
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="z-to-a"
                          name="sort"
                          checked={sortBy == "za"}
                          onChange={() => handleSortChange("za")}
                        />
                        <label className="form-check-label" htmlFor="z-to-a">
                          Từ Z đến A
                        </label>
                      </div>

                      {/* Radio Button: Giá thấp đến cao */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="price-asc"
                          name="sort"
                          checked={sortBy == "priceasc"}
                          onChange={() => handleSortChange("priceasc")}
                        />
                        <label className="form-check-label" htmlFor="price-asc">
                          Giá thấp đến cao
                        </label>
                      </div>

                      {/* Radio Button: Giá cao đến thấp */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="price-desc"
                          name="sort"
                          checked={sortBy == "pricedesc"}
                          onChange={() => handleSortChange("pricedesc")}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="price-desc"
                        >
                          Giá cao đến thấp
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="filter-item">
                  <div className="filter-header" onClick={toggleLanguage}>
                    <h5>Hình thức học</h5>
                    <i
                      className={`fas ${
                        isLanguageOpen ? "fa-chevron-up" : "fa-chevron-down"
                      }`}
                    ></i>
                  </div>
                  {isLanguageOpen && (
                    <div className="filter-content">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="course-type"
                          id="online-course"
                          checked={courseType == "ONLINE"}
                          onChange={() => handleCourseTypeChange("ONLINE")}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="online-course"
                        >
                          Học trực tuyến (
                          {
                            courses.filter(
                              (course) => course.courseType === "ONLINE"
                            ).length
                          }
                          )
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="course-type"
                          id="offline-course"
                          checked={courseType == "OFFLINE"}
                          onChange={() => handleCourseTypeChange("OFFLINE")}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="offline-course"
                        >
                          Học trực tiếp (
                          {
                            courses.filter(
                              (course) => course.courseType === "OFFLINE"
                            ).length
                          }
                          )
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="filter-item">
                  <div className="filter-header" onClick={toggleRatings}>
                    <h5>Đánh giá người học</h5>
                    <i
                      className={`fas ${
                        isRatingsOpen ? "fa-chevron-up" : "fa-chevron-down"
                      }`}
                    ></i>
                  </div>
                  {isRatingsOpen && (
                    <div className="filter-content">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="rating"
                          id="rating-5"
                        />
                        <label className="form-check-label" htmlFor="rating-5">
                          {[...Array(5)].map((_, index) => (
                            <i
                              key={index}
                              className={`fas ${
                                index < 5 ? "fa-star text-warning" : "fa-star"
                              }`}
                              style={{ fontSize: "14px" }}
                            ></i>
                          ))}
                          <span style={{ marginLeft: "10px" }}>5.0 & up</span>
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="rating"
                          id="rating-4"
                        />
                        <label className="form-check-label" htmlFor="rating-4">
                          {[...Array(5)].map((_, index) => (
                            <i
                              key={index}
                              className={`fas ${
                                index < 4 ? "fa-star text-warning" : "fa-star"
                              }`}
                              style={{ fontSize: "14px" }}
                            ></i>
                          ))}
                          <span style={{ marginLeft: "10px" }}>4.0 & up</span>
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="rating"
                          id="rating-3"
                        />
                        <label className="form-check-label" htmlFor="rating-3">
                          {[...Array(5)].map((_, index) => (
                            <i
                              key={index}
                              className={`fas ${
                                index < 3 ? "fa-star text-warning" : "fa-star"
                              }`}
                              style={{ fontSize: "14px" }}
                            ></i>
                          ))}
                          <span style={{ marginLeft: "10px" }}>3.0 & up</span>
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="rating"
                          id="rating-2"
                        />
                        <label className="form-check-label" htmlFor="rating-2">
                          {[...Array(5)].map((_, index) => (
                            <i
                              key={index}
                              className={`fas ${
                                index < 2 ? "fa-star text-warning" : "fa-star"
                              }`}
                              style={{ fontSize: "14px" }}
                            ></i>
                          ))}
                          <span style={{ marginLeft: "10px" }}>2.0 & up</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentCourses.length > 0 ? (
            <div
              className={isFilterOpen ? "col-md-9" : "col-md-12"}
              style={{ marginTop: "12px" }}
            >
              <div className="product-list">
                {currentCourses.map((course, index) => (
                  <SearchCard course={course} key={index} />
                ))}
              </div>
              <div className="pagination justify-content-center">
                <button
                  className="pagination-btn"
                  onClick={() => handleClick(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <span>&lt;</span>
                </button>

                {getPages().map((page, index) =>
                  page === "..." ? (
                    <span key={index} className="pagination-ellipsis">
                      ...
                    </span>
                  ) : (
                    <button
                      key={index}
                      className={`pagination-number ${
                        currentPage === page ? "active" : ""
                      }`}
                      onClick={() => handleClick(page as number)}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  className="pagination-btn"
                  onClick={() => handleClick(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <span>&gt;</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`no-results ${
                isFilterOpen ? "col-md-9" : "col-md-12"
              }`}
            >
              <img
                src="https://easylearning.blob.core.windows.net/images-videos/search.png"
                alt="No courses found"
              />
              <p className="no-results-hint">
                Hãy thử điều chỉnh tìm kiếm của bạn. Dưới đây là một số gợi ý:
              </p>
              <ul className="no-results-list">
                <li>Đảm bảo tất cả các từ được viết đúng chính tả.</li>
                <li>Thử các cụm từ tìm kiếm khác.</li>
                <li>Thử các cụm từ tìm kiếm tổng quát hơn.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </ClientShared>
  );
};

export default SearchCourse;
