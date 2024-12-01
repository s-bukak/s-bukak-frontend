import React, { useState } from "react";
import { HiMiniXMark } from "react-icons/hi2";
import axiosInstance from "../../utils/axiosInstance"; // Axios 인스턴스
import { isTokenValid } from "../../utils/token"; // 토큰 유효성 검사

const DeleteAccountModal = ({ email, onClose, onDeleteSuccess }) => {
    const [inputEmail, setInputEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState(null); // 에러 메시지 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const isMatch = inputEmail === email; // 입력한 이메일이 가입 이메일과 일치 여부

    const handleDelete = async () => {
        if (!isTokenValid()) {
            setErrorMessage("로그인 상태가 유효하지 않습니다. 다시 로그인해주세요.");
            return;
        }

        setLoading(true);
        setErrorMessage(null); // 기존 에러 메시지 초기화
        try {
            await axiosInstance.delete("/withdraw"); // 회원 탈퇴 API 호출
            setLoading(false);
            onDeleteSuccess(); // 성공 시 상위 컴포넌트에 알림
        } catch (error) {
            console.error("회원 탈퇴 중 오류 발생:", error);
            setErrorMessage("회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-96 p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">회원 탈퇴</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <HiMiniXMark className="text-3xl" />
                    </button>
                </div>

                <p className="text-gray-600 text-xs mb-4">
                    가입한 이메일 <span className="underline">{email}</span>을 입력한 후, 하단의{" "}
                    <span className="font-bold">[회원 탈퇴]</span> 버튼을 누르면 탈퇴가 완료됩니다. 😢
                </p>

                <input
                    type="email"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    placeholder="이메일을 입력하세요."
                    className="w-full px-3 py-2 border rounded mb-4 text-sm"
                />

                {errorMessage && <p className="text-red-500 text-xs mb-4">{errorMessage}</p>}

                <button
                    onClick={handleDelete}
                    disabled={!isMatch || loading}
                    className={`mt-2 w-full py-2 rounded text-white font-bold ${
                        isMatch ? "bg-red-700" : "bg-gray-400"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {loading ? "탈퇴 처리 중..." : "회원 탈퇴"}
                </button>
            </div>
        </div>
    );
};

export default DeleteAccountModal;
