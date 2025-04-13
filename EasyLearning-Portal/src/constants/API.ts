// const BASE_URL = "https://sd75skpq-8080.asse.devtunnels.ms";
// const BASE_URL = "http://localhost:8080";
const BASE_URL = "http://localhost:3000";
/* 
  authentication
*/
const BASE_URL_AUTH = BASE_URL + "/auth";
const LOGIN_URL = BASE_URL_AUTH + "/login";
const GET_USER_INFO_URL = BASE_URL_AUTH + "/me";
const LOGIN_WITH_GOOGLE = BASE_URL_AUTH + "/loginWithGoogle"
const REGISTER_URL = BASE_URL_AUTH + "/signup";
/* 
  authentication
*/

/* 
  Category
*/
const BASE_URL_CATEGORY = BASE_URL + "/categories";
const BASE_URL_CREATE_CATEGORY = BASE_URL_CATEGORY + "/create";
const BASE_URL_UPDATE_CATEGORY = BASE_URL_CATEGORY + "/update";
const GET_ALL_CATEGORY_WITH_COURSE = BASE_URL_CATEGORY + "/get-all-category-with-course";
const GET_TOP_FOUR_MOST_CATEGORY = BASE_URL_CATEGORY + "/top-four-most-category";
const GET_COURSE_BY_CATEGORY = BASE_URL_CATEGORY + "/get-category-with-course";

/* 
  Category
*/

/* 
  Event
*/
const BASE_URL_EVENT = BASE_URL + "/courseEvent";
const BASE_URL_CREATE_EVENT = BASE_URL_EVENT + "/create";
const BASE_URL_UPDATE_EVENT = BASE_URL_EVENT + "/update";

/*

/* 
  Course
*/
const BASE_URL_COURSE = BASE_URL + "/courses";
const BASE_URL_CREATE_COURSE = BASE_URL_COURSE + "/create";
const BASE_URL_UPDATE_COURSE = BASE_URL_COURSE + "/update";

/* 
  Course
*/



/*
  user
*/

const BASE_URL_USER = BASE_URL + "/users";
const BASE_URL_CUSTOMER = BASE_URL + "/customers";
const GET_COURSE_BY_USER = BASE_URL_CUSTOMER + "/purchased-courses";
const GET_EVENTS_BY_USER = BASE_URL_CUSTOMER + "/schedule";
const GET_COURSE_STATUS_BY_USER = BASE_URL_CUSTOMER + "/course-status"


const GET_TRAINING_PROGRESS_STATUS = BASE_URL + "/training-progress/course-and-user"
const UPDATE_TRAINING_PROGRESS = BASE_URL + "/training-progress/status-part-process"
const GET_QUESTION_BY_TRAINING_PART = BASE_URL + "/exercises/by-training-part"
const GET_SAVED_SCORE_BY_TRAINING_PART = BASE_URL + "/training-progress/by-part"


const GET_NOTES_BY_COURSE_AND_USER = BASE_URL_CUSTOMER + "/my-note-by-course"
const ADD_NOTE_BY_COURSE_AND_USER = BASE_URL_CUSTOMER + "/add-note-by-course"
const UPDATE_NOTE_BY_COURSE_AND_USER = BASE_URL_CUSTOMER + "/update-note-by-course"
const DELETE_NOTE_BY_COURSE_AND_USER = BASE_URL_CUSTOMER + "/delete-note-by-course"



const ADD_TO_FEEDBACK = BASE_URL + "/customer/addToFeedback"

const GET_ALL_CERTIFICATE_BY_USER = BASE_URL + "/certificates/by-user"
const CREATE_CERTIFICATE = BASE_URL + "/certificates/create"
const GET_CERTIFICATE_BY_USER_AND_COURSE = BASE_URL + "/certificates/by-user-and-course"

const GET_NOTIFICATION_BY_USER = BASE_URL + "/customer/notificationByUser"
const UPDATE_NOTIFICATION_READ_STATUS = BASE_URL + "/customer/updateNotificationStatusIsRead"
const UPDATE_PROFILE_USER = BASE_URL + "/customer/updateProfile"
const CHANGE_PASSWORD_BY_USER = BASE_URL + "/customer/changePassword"
const FORGOT_PASSWORD_URL = BASE_URL + "/email/sendVerificationCode"
const VERIFY_CODE_URL = BASE_URL + "/email/verifyCode"
const RESET_PASSWORD = BASE_URL + "/customer/resetPassword"


const GET_ALL_COMMENT_BY_TRAINING_PART = BASE_URL + "/comments/by-trainingPart"


const TOGGLE_FAVORITE_COURSE = BASE_URL_CUSTOMER + "/toggle-favorite"
const GET_ALL_FAVORITE_COURSE_BY_COURSE = BASE_URL_CUSTOMER + "/my-favorites-course"


const GET_PURCHASE_HISTORY = BASE_URL_CUSTOMER + "/purchased-history"
const ADD_COURSE_FREE = BASE_URL_CUSTOMER + "/add-course-free"

/*
  users
*/

/**
 * home
 */
const GET_COURSES_MOST_REGISTERED = BASE_URL + "/top-registered";

const GET_ALL_COURSE = BASE_URL + "/get-all-course";

const GET_COURSE_DETAIL = BASE_URL + "/detail-course";
const GET_FEEDBACKS_FOR_COURSE_PUBLIC = BASE_URL + "/feedbacks-by-course-public";

const SEARCH_COURSES = BASE_URL + "/search";
const GET_FEEDBACKS_WITH_FIVE_RATING = BASE_URL + "/feedbacks-with-five-rating";
const GET_COURSES_WITH_DISCOUNT = BASE_URL + "/get-course-with-discount";
const GET_COURSES_WITH_FREE = BASE_URL + "/get-course-with-free";



/**
 * home
 */

/**
 * Shopping cart
 */
const BASE_URL_SHOPPING_CART = BASE_URL + "/shopping-carts";
const ADD_TO_CART = BASE_URL_SHOPPING_CART + "/add-to-cart";
const REMOVE_FROM_CART = BASE_URL_SHOPPING_CART + "/remove-card";
const GET_COUPONS_BY_USER = BASE_URL + "/discounts/get-all-discount-by-user"

/**
 * Shopping cart
 */

/**
 * payment
 */
const BASE_URL_PAYMENT = BASE_URL + "/payments";
const DO_PAYMENT_MOMO = BASE_URL_PAYMENT + "/do-payment-momo";
const CONFIRM_PAYMENT_MOMO = BASE_URL_PAYMENT + "/confirm-payment-momo";
const CONFIRM_PAYMENT_VNPAY = BASE_URL_PAYMENT + "/confirmPaymentVNPayClient";
const UPDATE_DISCOUNT_USER = BASE_URL + "/discount/updateUserDiscount"
const DO_PAYMENT_VNPAY = BASE_URL_PAYMENT + "/doPaymentVNPay"
/**
 * payment
 */
export {
  BASE_URL,
  LOGIN_URL,
  GET_USER_INFO_URL,
  GET_COURSES_MOST_REGISTERED,
  BASE_URL_SHOPPING_CART,
  REGISTER_URL,
  GET_ALL_CATEGORY_WITH_COURSE,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  DO_PAYMENT_MOMO,
  CONFIRM_PAYMENT_MOMO,
  GET_COURSE_DETAIL,
  GET_COURSE_BY_USER,
  GET_EVENTS_BY_USER,
  GET_FEEDBACKS_FOR_COURSE_PUBLIC,
  GET_COURSE_BY_CATEGORY,
  GET_TOP_FOUR_MOST_CATEGORY,
  GET_ALL_COURSE,
  SEARCH_COURSES,
  GET_COURSE_STATUS_BY_USER,
  GET_TRAINING_PROGRESS_STATUS,
  UPDATE_TRAINING_PROGRESS,
  GET_QUESTION_BY_TRAINING_PART,
  GET_SAVED_SCORE_BY_TRAINING_PART,
  GET_ALL_CERTIFICATE_BY_USER,
  ADD_TO_FEEDBACK,
  UPDATE_DISCOUNT_USER,
  GET_COUPONS_BY_USER,
  CREATE_CERTIFICATE,
  GET_CERTIFICATE_BY_USER_AND_COURSE,
  LOGIN_WITH_GOOGLE,
  GET_NOTIFICATION_BY_USER,
  UPDATE_NOTIFICATION_READ_STATUS,
  UPDATE_PROFILE_USER,
  CHANGE_PASSWORD_BY_USER,
  FORGOT_PASSWORD_URL,
  VERIFY_CODE_URL,
  RESET_PASSWORD,
  BASE_URL_CREATE_COURSE,
  BASE_URL_COURSE,
  GET_FEEDBACKS_WITH_FIVE_RATING,
  GET_COURSES_WITH_DISCOUNT,
  GET_NOTES_BY_COURSE_AND_USER,
  ADD_NOTE_BY_COURSE_AND_USER,
  UPDATE_NOTE_BY_COURSE_AND_USER,
  DELETE_NOTE_BY_COURSE_AND_USER,
  TOGGLE_FAVORITE_COURSE,
  GET_ALL_FAVORITE_COURSE_BY_COURSE,
  GET_PURCHASE_HISTORY,
  GET_COURSES_WITH_FREE,
  ADD_COURSE_FREE,
  DO_PAYMENT_VNPAY,
  CONFIRM_PAYMENT_VNPAY,
  BASE_URL_USER,
  BASE_URL_EVENT,
  BASE_URL_CREATE_CATEGORY,
  BASE_URL_CATEGORY,
  BASE_URL_UPDATE_CATEGORY,
  BASE_URL_CREATE_EVENT,
  BASE_URL_UPDATE_EVENT,
  BASE_URL_UPDATE_COURSE,
  GET_ALL_COMMENT_BY_TRAINING_PART
};
