import axios from "axios";

const axiosInstance = axios.create();

let isRefreshing = false;
let refreshSubscribers = [];

axiosInstance.interceptors.request.use(
  async (config) => {
    const getToken = localStorage.getItem("access_token");
    const token = JSON.parse(getToken); // Replace with your actual access token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        try {
          const response = await new Promise((resolve) => {
            refreshSubscribers.push((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            });
          });

          return response;
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axiosInstance.post(
          "https://api.example.com/refresh",
          {
            refreshToken: "YOUR_REFRESH_TOKEN", // Replace with your actual refresh token
          }
        );

        const { accessToken } = refreshResponse.data;

        // Update the access token in your authentication system
        // or wherever you store the access token

        refreshSubscribers = [];
        isRefreshing = false;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
