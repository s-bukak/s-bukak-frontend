import React, { useState } from 'react';
import { MdOutlineMail, MdOutlinePerson } from 'react-icons/md';
import {LuFlag} from "react-icons/lu";
import { HiMiniXMark } from "react-icons/hi2";

const UpdateInfoModal = ({ email, name, isTeamLeader, teamInfo, onClose, onUpdate }) => {
    const [newName, setNewName] = useState(name);
    const isModified = newName !== name; // 이름 필드 변경 여부

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-96 p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">정보 수정</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <HiMiniXMark className="text-3xl"/> {/* HiXMark 아이콘 사용 */}
                    </button>
                </div>

                {/* 이메일 필드 */}
                <div className="mb-4">
                    <label className="block text-gray-800 text-sm font-bold mb-2">이메일</label>
                    <div
                        className="flex items-center w-full px-3 py-2 border rounded shadow-sm bg-zinc-100 text-gray-700">
                        <MdOutlineMail className="text-gray-400 mr-2"/>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="flex-1 bg-transparent outline-none cursor-not-allowed text-gray-400 text-sm"
                        />
                    </div>
                </div>

                {/* 이름 필드 */}
                <div className="mb-4">
                    <label className="block text-gray-800 text-sm font-bold mb-2">이름</label>
                    <div className="flex items-center w-full px-3 py-2 border rounded shadow-sm text-gray-700">
                        <MdOutlinePerson className="text-gray-400 mr-2"/>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-sm"
                        />
                    </div>
                </div>

                {/* 팀 정보 필드 */}
                {isTeamLeader && (
                    <div className="mb-4">
                        <label className="block text-gray-800 text-sm font-bold mb-2">팀 정보</label>
                        <div
                            className="flex items-center w-full px-3 py-2 border rounded shadow-sm bg-zinc-100 text-gray-700">
                            <LuFlag className="text-gray-400 mr-2"/>
                            <input
                                type="text"
                                value={teamInfo}
                                disabled
                                className="flex-1 bg-transparent outline-none text-gray-400 text-sm"
                            />
                        </div>
                    </div>
                )}

                {/* 수정 완료 버튼 */}
                <button
                    onClick={() => onUpdate(newName)}
                    disabled={!isModified}
                    className={`mt-2 w-full py-2 rounded text-white font-bold ${
                        isModified ? 'bg-sky-600' : 'bg-gray-400'
                    }`}
                >
                    수정 완료
                </button>
            </div>
        </div>
    );
};

export default UpdateInfoModal;
