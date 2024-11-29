import axios from "axios";
import { getToken, removeToken } from "./token";
import {DOMAIN_NAME} from "../App";

const axiosInstance = axios.create({
    baseURL: DOMAIN_NAME,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            removeToken(); // 토큰 제거
            console.error("인증 오류: 로그아웃 처리");
            window.location.href = "/signin"; // 로그인 페이지로 리다이렉트
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
