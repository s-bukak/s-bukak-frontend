import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityButton from "../../../components/community/CommunityButton";
import { IoIosArrowDown } from "react-icons/io";
import axiosInstance from "../../../utils/axiosInstance";
import { isTokenValid } from "../../../utils/token";

export default function WriteCommunity() {
  const [selectedBoard, setSelectedBoard] = useState('게시판을 선택해 주세요');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용
  const isLoggedIn = isTokenValid();

  const handleUnderArrowClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleBoardSelection = (board) => {
    setSelectedBoard(board);
    setIsDropdownOpen(false);
  };

  const handleRegister = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const boardType = selectedBoard === '자유 게시판' ? 'FREE' : 'PRACTICE';
      const data = {
        title, content, boardType,
      };
      await axiosInstance.post(`/board`, data);
      alert("등록 성공!");
      navigate('/community'); // 게시판 페이지로 이동
    } catch (error) {
      console.error("등록 실패:", error);
      alert("등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex flex-row w-full gap-[75px]">
      <div className="pl-36 p-4">
        <CommunityButton />
      </div>

      <div className="w-3/5 p-4">
        {isLoggedIn ? (
          <div className="w-full border border-gray-300 rounded-lg overflow-hidden relative">
            <div className="flex justify-between px-8 pt-8 items-center">
              <div className="w-[20%] border-b pl-3 flex items-center relative justify-between">
                {selectedBoard}
                <div
                  onClick={handleUnderArrowClick}
                  className="cursor-pointer"
                >
                  <IoIosArrowDown />
                </div>
              </div>
              <button
                className="w-28 h-8 text-white font-bold bg-gray-800 rounded-lg md:w-28 md:h-8"
                onClick={handleRegister}
              >
                등록
              </button>
            </div>

            {isDropdownOpen && (
              <div className="absolute bg-white border border-gray-300 w-[20%] pl-1 shadow-lg z-10 rounded-lg ml-8 ">
                <div
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleBoardSelection('자유 게시판')}
                >
                  자유 게시판
                </div>
                <div
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleBoardSelection('연습상대 게시판')}
                >
                  연습상대 게시판
                </div>
              </div>
            )}

            <div className="flex justify-center px-8">
              <div className="w-full relative my-4">
                <input
                  type="text"
                  placeholder="제목"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="none-border bg-gray-100 rounded-lg p-2 w-full pl-4 pr-10"
                />
              </div>
            </div>

            <div className="flex justify-center items-center px-8">
              <div className="h-96 w-full mb-4">
                <textarea
                  placeholder="내용을 입력해주세요."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="border border-gray-400 rounded-lg p-4 w-full h-40 sm:h-60 md:h-72 lg:h-96"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600 text-lg mt-8">
            로그인이 필요합니다. 로그인 후 글쓰기를 이용할 수 있습니다.
          </div>
        )}
      </div>
    </div>
  );
}
