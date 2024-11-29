import React, { useState } from 'react';
import {HiMiniXMark} from "react-icons/hi2";

const DeleteAccountModal = ({ email, onClose, onDelete }) => {
    const [inputEmail, setInputEmail] = useState('');
    const isMatch = inputEmail === email; // 입력한 이메일이 가입 이메일과 일치 여부

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-96 p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">회원 탈퇴</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <HiMiniXMark className="text-3xl"/> {/* HiXMark 아이콘 사용 */}
                    </button>
                </div>

                <p className="text-gray-600 text-xs mb-4">
                    가입한 이메일 <span className="underline">{email}</span>을 입력한 후,
                    하단의 <span className="font-bold">[회원 탈퇴]</span> 버튼을 누르면 탈퇴가 완료됩니다. 😢
                </p>

                <input
                    type="email"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    placeholder="이메일을 입력하세요."
                    className="w-full px-3 py-2 border rounded mb-4 text-sm"
                />

                <button
                    onClick={() => onDelete()}
                    disabled={!isMatch}
                    className={`mt-2 w-full py-2 rounded text-white font-bold ${
                        isMatch ? 'bg-red-700' : 'bg-gray-400'
                    }`}
                >
                    회원 탈퇴
                </button>
            </div>
        </div>
    );
};

export default DeleteAccountModal;
