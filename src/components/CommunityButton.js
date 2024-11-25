import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import arrow from '../assets/icons/arrow.svg';

function CommunityButton() {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로를 가져오기
  const [activeButton, setActiveButton] = useState(); // 초기 상태

  // URL 경로에 따라 activeButton 상태 초기화
  useEffect(() => {
    if (location.pathname.includes('/my-wrote') || location.pathname.includes('/my-comment')) {
      setActiveButton('나의활동');
    } else {
      setActiveButton('게시판 정보');
    }
  }, [location.pathname]);

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
          <div
            className="flex justify-between items-center px-4 py-3 border-b border-gray-200 cursor-pointer"
            onClick={() => navigate('/free-community')}
          >
            <span className="text-sm font-bold">자유 게시판</span>
            <img src={arrow} alt="Arrow Icon" className="w-4 h-4" />
          </div>
          <div
            className="flex justify-between items-center px-4 py-3 cursor-pointer"
            onClick={() => navigate('/practice-community')}
          >
            <span className="text-sm font-bold">연습 상대 게시판</span>
            <img src={arrow} alt="Arrow Icon" className="w-4 h-4" />
          </div>
        </>
      );
    } else if (activeButton === '나의활동') {
      return (
        <>
          <div
            className="flex justify-between items-center px-4 py-3 border-b border-gray-200 cursor-pointer"
            onClick={() => navigate('/my-wrote')}
          >
            <span className="text-sm font-bold">내가 쓴 글</span>
            <img src={arrow} alt="Arrow Icon" className="w-4 h-4" />
          </div>
          <div
            className="flex justify-between items-center px-4 py-3 cursor-pointer"
            onClick={() => navigate('/my-comment')}
          >
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
        onClick={() => navigate('/write-community')} // navigate 사용
      >
        글쓰기
      </button>

      {/* 탭 및 리스트 컨테이너 */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {/* 탭 영역 */}
        <div className="flex border-b border-gray-300 py-1 px-1">
          <button
            className={getButtonClass('게시판 정보')}
            onClick={() => handleClick('게시판 정보')}
          >
            게시판 정보
          </button>
          <button
            className={getButtonClass('나의활동')}
            onClick={() => handleClick('나의활동')}
          >
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
