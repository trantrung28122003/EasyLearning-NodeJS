import { ApplicationRoute } from "../model/Route";
import LazyLoadComponent from "../components/lazyLoadComponent/LazyLoadComponent";
export const RoutesConfig: ApplicationRoute[] = [
  {
    path: "/",
    component: LazyLoadComponent(import("../pages/Client/Home/Home")),
    isProtected: false,
    isAdmin: false,
  },
  {
    path: "/",
    component: LazyLoadComponent(import("../pages/Client/Course/Course")),
    isProtected: false,
    isAdmin: false,
  },
  {
    path: "/403",
    component: LazyLoadComponent(import("../pages/Errors/403/Code403")),
    isProtected: false,
    isAdmin: false,
  },
  {
    path: "/404",
    component: LazyLoadComponent(import("../pages/Errors/404/Code404")),
    isProtected: false,
    isAdmin: false,
  },
  {
    path: "/login",
    component: LazyLoadComponent(
      import("../pages/Client/Authentication/Login")
    ),
    isProtected: false,
    isAdmin: false,
  },
  {
    path: "/login123",
    component: LazyLoadComponent(
      import("../pages/Client/Authentication/login123")
    ),
    isProtected: false,
    isAdmin: false,
  },
  {
    path: "/register",
    component: LazyLoadComponent(
      import("../pages/Client/Authentication/Register")
    ),
    isProtected: false,
    isAdmin: false,
  },

  {
    path: "/forgetPassword",
    component: LazyLoadComponent(
      import("../pages/Client/Authentication/ForgetPassword")
    ),
    isProtected: false,
    isAdmin: false,
  },
  {
    path: "/about",
    component: LazyLoadComponent(import("../pages/Client/About/About")),
    isProtected: false,
    isAdmin: false,
  },
  {
    path: "/shoppingCart",
    component: LazyLoadComponent(
      import("../pages/Client/ShoppingCart/ShoppingCart")
    ),
    isProtected: true,
    isAdmin: false,
  },
  {
    path: "/admin/dashboard",
    component: LazyLoadComponent(import("../pages/Admin/Dashboard/Dashboard")),
    isProtected: true,
    isAdmin: true,
  },
  {
    path: "/admin/dashboard",
    component: LazyLoadComponent(import("../pages/Admin/Dashboard/Dashboard")),
    isProtected: true,
    isAdmin: true,
  },
  {
    path: "/admin/course",
    component: LazyLoadComponent(import("../pages/Admin/Course/Courses")),
    isProtected: true,
    isAdmin: true,
  },
  {
    path: "/admin/course/create",
    component: LazyLoadComponent(import("../pages/Admin/Course/CreateCourse")),
    isProtected: true,
    isAdmin: true,
  },
  {
    path: "/admin/course/details",
    component: LazyLoadComponent(import("../pages/Admin/Course/DetailCourse")),
    isProtected: true,
    isAdmin: true,
  },
  {
    path: "/admin/course/update",
    component: LazyLoadComponent(import("../pages/Admin/Course/UpdateCourse")),
    isProtected: true,
    isAdmin: true,
  },
  {
    path: "/admin/event",
    component: LazyLoadComponent(import("../pages/Admin/Event/Events")),
    isProtected: true,
    isAdmin: true,
  },
  {
    path: "/admin/event/create",
    component: LazyLoadComponent(import("../pages/Admin/Event/CreateEvent")),
    isProtected: true,
    isAdmin: true,
  },
  {
    path: "/admin/event/detail",
    component: LazyLoadComponent(import("../pages/Admin/Event/EventDetail")),
    isProtected: true,
    isAdmin: true,
  },
  {
    path: "/admin/event/update",
    component: LazyLoadComponent(import("../pages/Admin/Event/UpdateEvent")),
    isProtected: true,
    isAdmin: true,
  },
  {
    path: "/admin/category",
    component: LazyLoadComponent(import("../pages/Admin/Category/Categories")),
    isProtected: true,
    isAdmin: true,
  },
  {
    path: "/admin/category/create",
    component: LazyLoadComponent(
      import("../pages/Admin/Category/CreateCategory")
    ),
    isProtected: true,
    isAdmin: true,
  },
  {
    path: "/admin/category/update",
    component: LazyLoadComponent(
      import("../pages/Admin/Category/UpdateCategory")
    ),
    isProtected: true,
    isAdmin: true,
  },
  {
    path: "/admin/category/detail",
    component: LazyLoadComponent(
      import("../pages/Admin/Category/CategoryDetail")
    ),
    isProtected: true,
    isAdmin: true,
  },
  {
    path: "/admin/user",
    component: LazyLoadComponent(
      import("../pages/Admin/User/UsersManagement")
    ),
    isProtected: true,
    isAdmin: true,
  },


  {
    path: "/courses/",
    component: LazyLoadComponent(import("../pages/Client/Course/Course")),
    isProtected: false,
    isAdmin: false,
  },
  {
    path: "/courses/:categoryId",
    component: LazyLoadComponent(import("../pages/Client/Course/Course")),
    isProtected: false,
    isAdmin: false,
  },
  {
    path: "/course/:courseId",
    component: LazyLoadComponent(
      import("../pages/Client/Course/CourseDetail/CourseDetail")
    ),
    isProtected: false,
    isAdmin: false,
  },
  {
    path: "/checkout",
    component: LazyLoadComponent(import("../pages/Client/CheckOut/CheckOut")),
    isProtected: true,
    isAdmin: false,
  },
  {
    path: "/checkout/confirmPaymentMomoClient",
    component: LazyLoadComponent(
      import("../pages/Client/CheckOut/CheckOutResult/CheckoutMomoResult")
    ),
    isProtected: true,
    isAdmin: false,
  },

  {
    path: "/checkout/confirmPaymentVNPayClient",
    component: LazyLoadComponent(
      import("../pages/Client/CheckOut/CheckOutResult/CheckoutVNPayResult")
    ),
    isProtected: true,
    isAdmin: false,
  },
  
  {
    path: "/paymentFailure",
    component: LazyLoadComponent(import("../pages/Client/CheckOut/CheckOutResult/PaymentFailure")),
    isProtected: true,
    isAdmin: false,
  },
  {
    path: "/paymentSuccess",
    component: LazyLoadComponent(import("../pages/Client/CheckOut/CheckOutResult/PaymentSuccess")),
    isProtected: true,
    isAdmin: false,
  },
  {
    path: "/userCourses",
    component: LazyLoadComponent(
      import("../pages/Client/Course/UserCourse/UserCourse")
    ),
    isProtected: true,
    isAdmin: false,
  },
  {
    path: "/schedule",
    component: LazyLoadComponent(import("../pages/Client/Schedule/UserSchedule")),
    isProtected: true,
    isAdmin: false,
  },

  {
    path: "/courses/search",
    component: LazyLoadComponent(import("../pages/Client/Course/Search/SearchCourse")),
    isProtected: true,
    isAdmin: false,
  },



  {
    path: "/learning/:courseId",
    component: LazyLoadComponent(import("../pages/Client/Learning/Learning")),
    isProtected: true,
    isAdmin: false,
  },

  {
    path: "/quiz",
    component: LazyLoadComponent(import("../pages/Client/Learning/QuizApp/ExerciseQuiz")),
    isProtected: true,
    isAdmin: false,
  },
  {
    path: "/certificate",
    component: LazyLoadComponent(import("../pages/Client/UserCertificate/UserCertificate")),
    isProtected: true,
    isAdmin: false,
  },
  {
    path: "/ConfirmCertificate",
    component: LazyLoadComponent(import("../pages/Client/UserCertificate/ConfirmCertificate")),
    isProtected: true,
    isAdmin: false,
  },

  {
    path: "/userProfile",
    component: LazyLoadComponent(import("../pages/Client/UserSetting/UserSetting")),
    isProtected: true,
    isAdmin: false,
  },

  {
    path: "/favoriteCourse",
    component: LazyLoadComponent(import("../pages/Client/Favorite/Favorite")),
    isProtected: true,
    isAdmin: false,
  },
  {
    path: "/purchaseHistory",
    component: LazyLoadComponent(import("../pages/Client/PurchaseHistory/PurchaseHistory")),
    isProtected: true,
    isAdmin: false,
  },
];
