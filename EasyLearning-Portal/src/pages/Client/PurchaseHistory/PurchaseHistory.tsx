import { useEffect, useState } from "react";
import ClientShared from "../Shared/ClientShared";
import { User } from "../../../model/User";
import { getUserInfo } from "../../../hooks/useLogin";
import { DoCallAPIWithToken } from "../../../services/HttpService";
import { GET_PURCHASE_HISTORY } from "../../../constants/API";
import { HTTP_OK } from "../../../constants/HTTPCode";
import DataLoader from "../../../components/lazyLoadComponent/DataLoader";
import { formatDateVN } from "../../../hooks/useTime";
import { formatCurrency } from "../../../hooks/useCurrency";
import { useNavigate } from "react-router-dom";

export interface OrderDetailResponse {
  price: number;
  priceDiscount: number;
  orderDate: string;
  courseName: string;
  isFree: boolean;
}

export interface PurchaseHistoryResponse {
  initialAmount: number;
  discountedAmount: number;
  dateOfFirstPurchase: string;
  dateOfLatestPurchase: string;
  orderDetailResponseList: OrderDetailResponse[];
}

const PurchaseHistory = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseHistory, setPurchaseHistory] =
    useState<PurchaseHistoryResponse | null>();
  const fetchPurchasesHistory = async () => {
    setIsLoading(true);
    try {
      const URL = GET_PURCHASE_HISTORY;
      const response = await DoCallAPIWithToken(URL, "GET");
      if (response.status === HTTP_OK) {
        const data = await response.data.result;
        setPurchaseHistory(data);
        console.log(purchaseHistory);
      }
    } catch (error) {
      console.error("Error fetching course status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentUser(getUserInfo);
    fetchPurchasesHistory();
  }, []);

  return (
    <ClientShared>
      <>
        <DataLoader isLoading={isLoading} />
        {purchaseHistory &&
        purchaseHistory.orderDetailResponseList.length === 0 ? (
          <div className="col-lg-12 text-header">
            <div className="centered-content">
              <img
                src="https://easylearning.blob.core.windows.net/images-videos/icon-notification.png"
                style={{ width: "380px" }}
                alt="No data"
              />
              <h2 className="warning-message">
                Bạn chưa đăng ký bất kì khóa học nào!
              </h2>
              <h1>Vui lòng chọn khóa học bạn muốn để đăng ký.</h1>
              <p>
                Theo dõi website thường xuyên để cập nhật thông tin khóa học mới
                nhất, giúp bạn không bỏ lỡ bất kỳ cơ hội học nào!
              </p>
              <button
                className="explore-course-btn"
                onClick={() => navigate("/courses/search")}
              >
                Khám phá các khóa học
              </button>
            </div>
          </div>
        ) : (
          <div className="page-content container">
            <div className="container px-0">
              <div className="row">
                <div className="col-12 col-lg-12" style={{ marginTop: "28px" }}>
                  <div className="row">
                    <div className="col-12">
                      <div className="text-center text-150">
                        <i
                          className="fa fa-history fa-2x text-custom"
                          style={{ padding: "12px" }}
                        ></i>
                        <span>
                          <strong
                            className="text-custom"
                            style={{ fontSize: "30px" }}
                          >
                            LỊCH SỬ THAM GIA VÀ MUA KHÓA HỌC
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <hr className="row brc-default-l1 mx-n1 mb-4" />

                  <div className="row">
                    <div className="col-sm-6">
                      <div>
                        <span className="text-sm text-grey-m2 align-middle">
                          Gửi:{" "}
                        </span>
                        <span className="text-600 text-110 text-custom align-middle">
                          {currentUser?.fullName}
                        </span>
                      </div>
                      <div className="text-grey-m2">
                        <div className="my-1">
                          <i className="fa fa-envelope text-secondary">:</i>{" "}
                          <b className="text-600">{currentUser?.email}</b>
                        </div>
                      </div>
                    </div>

                    <div className="text-95 col-sm-6 align-self-start d-sm-flex justify-content-end">
                      <hr className="d-sm-none" />
                      <div className="text-grey-m2">
                        <div className="mt-1 mb-2 text-secondary-m1 text-600 text-125">
                          Trạng thái
                        </div>
                        <div className="my-2">
                          <i className="fa fa-circle text-custom text-xs mr-1"></i>{" "}
                          <span className="text-600 text-90">
                            Lần đầu mua khóa học:
                          </span>{" "}
                          {purchaseHistory &&
                            formatDateVN(purchaseHistory?.dateOfFirstPurchase)}
                        </div>
                        <div className="my-2">
                          <i className="fa fa-circle text-custom text-xs mr-1"></i>{" "}
                          <span className="text-600 text-90">
                            Lần gần đây mua khóa học:
                          </span>{" "}
                          {purchaseHistory &&
                            formatDateVN(purchaseHistory?.dateOfLatestPurchase)}
                        </div>
                        <div className="my-2">
                          <i className="fa fa-circle text-custom text-xs mr-1"></i>{" "}
                          <span className="text-600 text-90">Trạng thái:</span>{" "}
                          <span className="badge badge-warning badge-pill px-25">
                            Đã thanh toán
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="row text-600 text-white bg-custom py-25">
                      <div className="d-none d-sm-block col-1">#</div>
                      <div className="col-9 col-sm-5">Tên khóa học</div>
                      <div className="d-none d-sm-block col-4 col-sm-2">
                        Ngày mua
                      </div>
                      <div className="d-none d-sm-block col-sm-2">
                        Giá khóa học
                      </div>
                      <div className="col-2">Tổng giá</div>
                    </div>

                    {purchaseHistory?.orderDetailResponseList &&
                      purchaseHistory.orderDetailResponseList.map(
                        (orderDetail, index) => (
                          <div
                            className="text-95 text-secondary-d3"
                            key={index}
                          >
                            <div className="row mb-2 mb-sm-0 py-25">
                              <div className="d-none d-sm-block col-1">
                                {index + 1}
                              </div>
                              <div className="col-9 col-sm-5">
                                {orderDetail.courseName}
                              </div>
                              <div className="d-none d-sm-block col-2">
                                {formatDateVN(orderDetail.orderDate)}
                              </div>
                              <div className="d-none d-sm-block col-2 text-95">
                                {orderDetail.isFree
                                  ? "Miễn Phí"
                                  : formatCurrency(orderDetail.price) + "₫"}
                              </div>
                              <div className="col-2 text-secondary-d2">
                                {orderDetail.isFree
                                  ? "Miễn Phí"
                                  : formatCurrency(orderDetail.priceDiscount) +
                                    "₫"}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    <div className="row border-b-2 brc-default-l2"></div>
                    <div className="row mt-3">
                      <div className="col-12 col-sm-7 text-grey-d2 text-95 mt-2 mt-lg-0">
                        Thông tin giá các khóa học của bạn mua được tính tại
                        thời điểm đó ...
                      </div>
                      <div className="col-12 col-sm-5 text-grey text-90 order-first order-sm-last">
                        <div className="row my-2">
                          <div className="text-100 col-7 text-right">
                            Tổng số tiền các khóa học{" "}
                          </div>
                          <div className="col-5">
                            <span className="text-100 text-secondary-d1">
                              {formatCurrency(purchaseHistory?.initialAmount)}₫
                            </span>
                          </div>
                        </div>

                        <div className="row my-2">
                          <div className="text-100 col-7 text-right">
                            Tổng giá tiền được giảm giá
                          </div>
                          <div className="col-5">
                            <span className="text-100 text-secondary-d1">
                              {purchaseHistory &&
                                formatCurrency(
                                  purchaseHistory?.initialAmount -
                                    purchaseHistory?.discountedAmount
                                )}
                              ₫
                            </span>
                          </div>
                        </div>

                        <div className="row my-2">
                          <div className="col-7 text-right">
                            <span className="text-120 text-success-d3 opacity-2 fw-bold">
                              Tổng số tiền đã sử dụng ở eLEARNING
                            </span>
                          </div>
                          <div className="col-5">
                            <span className="text-120 text-success-d3 opacity-2 fw-bold">
                              {formatCurrency(
                                purchaseHistory?.discountedAmount
                              )}
                              ₫
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <hr />

                    <div className="mb-5">
                      <span className="text-secondary-d1 text-105 ">
                        Cảm ơn bạn đã tin tưởng và đồng hành cùng chúng tôi
                        eLEARNING
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </ClientShared>
  );
};

export default PurchaseHistory;
