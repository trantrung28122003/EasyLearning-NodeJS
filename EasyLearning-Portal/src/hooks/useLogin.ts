
import { User } from "../model/User";

const isUserLogin = (): boolean => {
  const authStr = localStorage.getItem("authentication");
  if (!authStr) return false;

  try {
    const auth = JSON.parse(authStr);
    return !!auth;
  } catch (error) {
    return false;
  }
};

const getCredentials = (): string => {
  if (localStorage.getItem("authentication") != null) {
    const authenticationInfo = JSON.parse(
      localStorage.getItem("authentication") || ""
    );
    return authenticationInfo || "";
  } else {
    return "";
  }
};

const getUserInfo = () => {
  if (localStorage.getItem("user_info") != null) {
    const userInfo: User = JSON.parse(localStorage.getItem("user_info") || "");
    return userInfo;
  } else {
    return null;
  }
};

const hasAdminRole = () => {
  const userInfoStr = localStorage.getItem("user_info");
  if (userInfoStr) {
    const res = JSON.parse(userInfoStr);
    return res.role === "ADMIN";
  }
  return false;
};


export { isUserLogin, getUserInfo, getCredentials, hasAdminRole };