import axios from "axios";
import store from "../Redux/Store";
import { setAuthUser } from "../Redux/AuthSlice";
import { disconnectSocket, setSocketAuthToken } from "../socket/socket";

let interceptorInitialized = false;

const authRoutes = new Set([
  "/login",
  "/signup",
  "/forget-password",
  "/login/otpVerification",
]);

export const clearAuthSession = () => {
  store.dispatch(setAuthUser(null));
  localStorage.removeItem("token");
  setSocketAuthToken(null);
  disconnectSocket();
};

export const redirectToLogin = () => {
  if (!authRoutes.has(window.location.pathname)) {
    window.location.replace("/login");
  }
};

export const setupAxiosInterceptors = () => {
  if (interceptorInitialized) {
    return;
  }

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      const hasToken = Boolean(localStorage.getItem("token"));

      if (status === 401 && hasToken) {
        clearAuthSession();
        redirectToLogin();
      }

      return Promise.reject(error);
    }
  );

  interceptorInitialized = true;
};

export default axios;
