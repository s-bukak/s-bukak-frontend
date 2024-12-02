import React, { useState } from "react";
import { MdOutlineMail, MdOutlinePerson } from "react-icons/md";
import { LuFlag } from "react-icons/lu";
import { HiMiniXMark } from "react-icons/hi2";
import axiosInstance from "../../utils/axiosInstance"; // Axios 인스턴스
import { setToken } from "../../utils/token"; // 토큰 관련 함수
import { jwtDecode } from "jwt-decode";

const UpdateInfoModal = ({ email, name, isTeamLeader, teamInfo, onClose, onUpdateSuccess }) => {
    const [newName, setNewName] = useState(name);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const isModified = newName !== name;

    const handleUpdate = async () => {
        setLoading(true);
        setErrorMessage(null);

        try {
            const response = await axiosInstance.patch(
                "/editProfile",
                { name: newName },
                { headers: { skipRefresh: true } }
            );

            // Authorization 헤더에서 토큰 추출
            const authorizationHeader = response.headers['authorization'];
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                throw new Error("Invalid token received from server headers");
            }

            const newToken = authorizationHeader.split(' ')[1]; // 'Bearer ' 뒤의 토큰 추출

            if (!newToken || typeof newToken !== "string") {
                throw new Error("Invalid token format");
            }

            setToken(newToken); // 새 토큰 저장
            const decoded = jwtDecode(newToken); // 토큰 디코딩
            onUpdateSuccess(decoded.name || "Unknown"); // 상위 컴포넌트에 이름 업데이트
            onClose(); // 모달 닫기
        } catch (error) {
            console.error("프로필 수정 중 오류 발생:", error);
            setErrorMessage(
                error.response?.data?.message || "프로필 수정 중 오류가 발생했습니다. 다시 시도해주세요."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-96 p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">정보 수정</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <HiMiniXMark className="text-3xl" />
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-800 text-sm font-bold mb-2">이메일</label>
                    <div className="flex items-center w-full px-3 py-2 border rounded shadow-sm bg-zinc-100 text-gray-700">
                        <MdOutlineMail className="text-gray-400 mr-2" />
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="flex-1 bg-transparent outline-none cursor-not-allowed text-gray-400 text-sm"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-800 text-sm font-bold mb-2">이름</label>
                    <div className="flex items-center w-full px-3 py-2 border rounded shadow-sm text-gray-700">
                        <MdOutlinePerson className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-sm"
                        />
                    </div>
                </div>

                {isTeamLeader && (
                    <div className="mb-4">
                        <label className="block text-gray-800 text-sm font-bold mb-2">팀 정보</label>
                        <div className="flex items-center w-full px-3 py-2 border rounded shadow-sm bg-zinc-100 text-gray-700">
                            <LuFlag className="text-gray-400 mr-2" />
                            <input
                                type="text"
                                value={teamInfo}
                                disabled
                                className="flex-1 bg-transparent outline-none text-gray-400 text-sm"
                            />
                        </div>
                    </div>
                )}

                {errorMessage && <p className="text-red-500 text-xs mb-4">{errorMessage}</p>}

                <button
                    onClick={handleUpdate}
                    disabled={!isModified || loading}
                    className={`mt-2 w-full py-2 rounded text-white font-bold ${
                        isModified ? "bg-sky-600" : "bg-gray-400"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {loading ? "수정 중..." : "수정 완료"}
                </button>
            </div>
        </div>
    );
};

export default UpdateInfoModal;
