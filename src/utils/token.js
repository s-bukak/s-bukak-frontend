import { jwtDecode } from "jwt-decode";

export const getToken = () => localStorage.getItem("access_token");

export const setToken = (token) => localStorage.setItem("access_token", token);

export const removeToken = () => localStorage.removeItem("access_token");

export const isTokenValid = () => {
    const token = getToken();
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        return decoded.exp * 1000 > Date.now(); // 만료 시간 확인
    } catch (error) {
        console.error("JWT 디코딩 오류:", error);
        return false;
    }
};