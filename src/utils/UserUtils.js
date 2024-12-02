import {jwtDecode} from "jwt-decode";
import {getToken} from "./token";

import userImage from "../assets/images/userImage.jpg";

/**
 * JWT에서 사용자 정보를 디코딩하는 함수
 * @returns {{ userId: number, userName: string, userImage: string } | null} 사용자 정보 객체 또는 null
 */
export const decodeUserInfo = () => {
    const token = getToken();
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);

        return {
            userId: decoded.userId,
            userName: decoded.name,
            userImage: decoded.image || userImage,
        };
    } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
    }
};
