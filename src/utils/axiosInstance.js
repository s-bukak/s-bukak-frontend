import axios from "axios";
import { getToken, setToken, removeToken } from "./token";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL, // 환경 변수로 설정된 베이스 URL
    headers: {
        "Content-Type": "application/json", // 모든 요청에 JSON 헤더 추가
    },
});

let isRefreshing = false; // 토큰 갱신 중 여부
let failedQueue = []; // 대기 중인 요청 목록

// 대기 중인 요청 처리
const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// 요청 인터셉터: Authorization 헤더에 토큰 추가
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error) // 요청 오류 처리
);

// 응답 인터셉터: 401 오류 처리 및 토큰 갱신
axiosInstance.interceptors.response.use(
    (response) => {
        // 응답 헤더에서 토큰 추출
        const newToken = response.headers['access-token'];
        if (newToken) {
            setToken(newToken); // 새 토큰 저장
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.headers.skipRefresh) {
            return Promise.reject(error);
        }

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axios.post(`${process.env.REACT_APP_BASE_URL}/refreshToken`, {
                    token: getToken(),
                });
                const newToken = data.access_token;

                if (!newToken || typeof newToken !== "string") {
                    throw new Error("Invalid token received from refresh endpoint");
                }

                setToken(newToken);
                axiosInstance.defaults.headers.Authorization = `Bearer ${newToken}`;
                processQueue(null, newToken);

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                removeToken();
                window.location.href = "/signin";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
