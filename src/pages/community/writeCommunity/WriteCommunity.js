import React, { useState } from 'react';
import CommunityButton from "../../../components/CommunityButton";
import underArrow from "../../../assets/icons/underArrow.svg";

export default function WriteCommunity() {
  const [selectedBoard, setSelectedBoard] = useState('게시판을 선택해 주세요');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleUnderArrowClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleBoardSelection = (board) => {
    setSelectedBoard(board);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-row w-full gap-[75px]">
      <div className="pl-36 p-4">
        <CommunityButton />
      </div>

      <div className="w-3/5 p-4">
        <div className="w-full border border-gray-300 rounded-lg overflow-hidden relative">
          <div className="flex justify-between px-8 pt-8 items-center">
            <div className="w-[20%] border-b pl-3 flex items-center relative justify-between">
              {selectedBoard}
              <img
                src={underArrow}
                alt="Under Arrow"
                onClick={handleUnderArrowClick}
                className="cursor-pointer"
              />
            </div>
            <button className="w-28 h-8 text-white font-bold bg-gray-800 rounded-lg md:w-28 md:h-8">
              등록
            </button>
          </div>

          {/* 드롭다운 메뉴 */}
          {isDropdownOpen && (
            <div className="absolute bg-white border border-gray-300 w-[20%] pl-1 shadow-lg z-10 rounded-lg ml-8 ">
              <div className="p-2 cursor-pointer hover:bg-gray-100" onClick={() => handleBoardSelection('자유 게시판')}>자유 게시판</div>
              <div className="p-2 cursor-pointer hover:bg-gray-100" onClick={() => handleBoardSelection('연습상대 게시판')}>연습상대 게시판</div>
            </div>
          )}

          <div className="flex justify-center px-8">
            <div className="w-full relative my-4">
              <input
                type="text"
                placeholder="제목"
                className="none-border bg-gray-100 rounded-lg p-2 w-full pl-4 pr-10"
              />
            </div>
          </div>

          <div className="flex justify-center items-center px-8">
            <div className="h-96  w-full  mb-4 ">
              <textarea
                placeholder="내용을 입력해주세요."
                className="border border-gray-400 rounded-lg p-4 w-full h-40 sm:h-60 md:h-72 lg:h-96"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
