import React from 'react';
import { useRecoilState } from 'recoil';
import { activeTabState,currentTabState } from '../../state/communityTabState';
import { useNavigate } from 'react-router-dom';

function CommunityButton() {
  const [activeButton, setActiveButton] = useRecoilState(activeTabState);
  const [, setCurrentTab] = useRecoilState(currentTabState);
  const navigate = useNavigate();

  const handleButtonClick = (button, tab) => {
    setActiveButton(button); // 활성 탭 상태 업데이트
    setCurrentTab(tab); // 현재 탭 상태 업데이트
    navigate("/community"); // 페이지 이동
  };

  const handleWriteClick = () => {
    navigate('/community/write'); // 글쓰기 페이지로 이동
  };

  const getButtonClass = (button) => {
    return activeButton === button
      ? 'w-1/2 text-center py-2 bg-sky-600 text-white rounded-lg text-sm'
      : 'w-1/2 text-center py-2 text-gray-400 text-sm';
  };

  const renderListItems = () => {
    if (activeButton === '게시판 정보') {
      return (
        <>
          <div
            className="flex justify-between items-center px-4 py-3 border-b border-gray-200 cursor-pointer"
            onClick={() => handleButtonClick('게시판 정보', '/free-community')}
          >
            <span className="text-sm font-bold">자유 게시판</span>
          </div>
          <div
            className="flex justify-between items-center px-4 py-3 cursor-pointer"
            onClick={() => handleButtonClick('게시판 정보', '/practice-community')}
          >
            <span className="text-sm font-bold">연습 상대 게시판</span>
          </div>
        </>
      );
    } else if (activeButton === '나의활동') {
      return (
        <>
          <div
            className="flex justify-between items-center px-4 py-3 border-b border-gray-200 cursor-pointer"
            onClick={() => handleButtonClick('나의활동', '/my-wrote')}
          >
            <span className="text-sm font-bold">내가 쓴 글</span>
          </div>
          <div
            className="flex justify-between items-center px-4 py-3 cursor-pointer"
            onClick={() => handleButtonClick('나의활동', '/my-comment')}
          >
            <span className="text-sm font-bold">댓글 단 글</span>
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
        onClick={handleWriteClick}
      >
        글쓰기
      </button>

      {/* 탭 및 리스트 컨테이너 */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {/* 탭 영역 */}
        <div className="flex border-b border-gray-300 py-1 px-1">
          <button
            className={getButtonClass('게시판 정보')}
            onClick={() => handleButtonClick('게시판 정보')}
          >
            게시판 정보
          </button>
          <button
            className={getButtonClass('나의활동')}
            onClick={() => handleButtonClick('나의활동')}
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
