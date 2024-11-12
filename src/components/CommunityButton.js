import React, { useState } from 'react';
import arrow from '../assets/icons/arrow.svg';

function CommunityButton() {
  const [activeButton, setActiveButton] = useState('게시판 정보');

  const handleClick = (button) => {
    setActiveButton(button);
  };

  const getButtonClass = (button) => {
    return activeButton === button
      ? 'w-1/2 text-center py-2 bg-sky-600 text-white rounded-lg'
      : 'w-1/2 text-center py-2 text-gray-400';
  };

  const renderListItems = () => {
    if (activeButton === '게시판 정보') {
      return (
        <>
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
            <span className="text-sm font-bold">자유 게시판</span>
            <img src={arrow} alt="Arrow Icon" className="w-4 h-4" />
          </div>
          <div className="flex justify-between items-center px-4 py-3">
            <span className="text-sm font-bold">연습상대 게시판</span>
            <img src={arrow} alt="Arrow Icon" className="w-4 h-4" />
          </div>
        </>
      );
    } else if (activeButton === '나의활동') {
      return (
        <>
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
            <span className="text-sm font-bold">내가 쓴 글</span>
            <img src={arrow} alt="Arrow Icon" className="w-4 h-4" />
          </div>
          <div className="flex justify-between items-center px-4 py-3">
            <span className="text-sm font-bold">댓글 단 글</span>
            <img src={arrow} alt="Arrow Icon" className="w-4 h-4" />
          </div>
        </>
      );
    }
  };

  return (
    <div className="w-full md:w-60">
      {/* 글쓰기 버튼 */}
      <button
        className="w-full h-12 text-white font-bold bg-gray-800 rounded-lg mb-4"
        onClick={() => window.location.href = '/write-community'}
      >
        글쓰기
      </button>

      {/* 탭 및 리스트 컨테이너 */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {/* 탭 영역 */}
        <div className="flex border-b border-gray-300">
          <button className={getButtonClass('게시판 정보')} onClick={() => handleClick('게시판 정보')}>
            게시판 정보
          </button>
          <button className={getButtonClass('나의활동')} onClick={() => handleClick('나의활동')}>
            나의활동
          </button>
        </div>

        {/* 리스트 영역 */}
        <div>
          {renderListItems()}
        </div>
      </div>
    </div>
  );
}

export default CommunityButton;
