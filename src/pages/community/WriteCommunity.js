import React, {useState} from 'react';
import {IoIosArrowDown} from "react-icons/io";
import axiosInstance from "../../utils/axiosInstance";
import {isTokenValid} from "../../utils/token";
import {useRecoilState} from 'recoil';
import {currentTabState} from '../../state/communityTabState';
import CommunityButton from "../../components/community/CommunityButton";
import {useNavigate} from "react-router-dom";

export default function WriteCommunity() {
  const [selectedBoard, setSelectedBoard] = useState('게시판 선택');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [modalMessage, setModalMessage] = useState(''); // 모달 메시지
  const [, setCurrentTab] = useRecoilState(currentTabState); // Recoil 상태로 탭 관리
  const isLoggedIn = isTokenValid();
  const navigate = useNavigate();
  const handleUnderArrowClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleBoardSelection = (board) => {
    setSelectedBoard(board);
    setIsDropdownOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (modalMessage === "등록 성공!") {
      const destinationTab = selectedBoard === '자유 게시판'
        ? '/free-community'
        : '/practice-community';
      setCurrentTab(destinationTab); // Recoil 상태 업데이트
      navigate('/community'); // 해당 경로로 이동
    }
  };

  const handleRegister = async () => {
    if (!isLoggedIn) {
      setModalMessage("로그인이 필요합니다.");
      setIsModalOpen(true);
      return;
    }

    if (selectedBoard === '게시판 선택') {
      setModalMessage("게시판을 선택해주세요.");
      setIsModalOpen(true);
      return;
    }

    if (!title.trim() || !content.trim()) {
      setModalMessage("제목과 내용을 모두 입력해주세요.");
      setIsModalOpen(true);
      return;
    }

    try {
      const boardType = selectedBoard === '자유 게시판' ? 'FREE' : 'PRACTICE';
      const data = {
        title, content, boardType,
      };
      await axiosInstance.post(`/board`, data);
      setModalMessage("등록 성공!");
      setIsModalOpen(true);
    } catch (error) {
      console.error("등록 실패:", error);
      setModalMessage("등록에 실패했습니다. 다시 시도해주세요.");
      setIsModalOpen(true);
    }
  };

  return (
    <div className="flex flex-row w-full my-20 justify-center gap-8">
      <CommunityButton/>
      <div className="w-3/5 flex flex-col gap-4">
        {isLoggedIn ? (
          <>
            <div
              className="w-full px-8 py-8 border border-gray-300 rounded-lg overflow-hidden relative flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="w-[21.5%] p-1 border-b pl-4 pr-2 flex items-center relative justify-between">
                  {selectedBoard}
                  <div
                    onClick={handleUnderArrowClick}
                    className="cursor-pointer"
                  >
                    <IoIosArrowDown className="text-gray-300"/>
                  </div>
                </div>
              </div>

              {isDropdownOpen && (
                <div
                  className="absolute bg-white border border-gray-200 w-[20%] p-1 z-10 rounded-md mt-10 shadow-md">
                  <div
                    className="p-2 cursor-pointer hover:bg-gray-100 rounded-sm transition-all"
                    onClick={() => handleBoardSelection('자유 게시판')}
                  >
                    자유 게시판
                  </div>
                  <div
                    className="p-2 cursor-pointer hover:bg-gray-100 rounded-sm transition-all"
                    onClick={() => handleBoardSelection('연습 상대 게시판')}
                  >
                    연습 상대 게시판
                  </div>
                </div>
              )}

              <div className="flex justify-center">
                <div className="w-full relative">
                  <input
                    type="text"
                    placeholder="제목"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="none-border bg-gray-100 rounded-lg p-2 w-full pl-4 pr-10 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-center items-center">
                <div className="h-96 w-full">
                  <textarea
                    placeholder="내용을 입력해주세요."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="border border-gray-300 rounded-lg p-4 w-full h-40 sm:h-60 md:h-72 lg:h-96 resize-none focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-row gap-4 justify-end mt-6">
              <button
                className="w-40 py-1 text-sm text-black font-bold bg-gray-300 rounded-lg"
                onClick={() => navigate(-1)} // 뒤로가기 동작
              >
                취소
              </button>

              <button
                className="w-40 py-1 text-sm text-white font-bold bg-gray-800 rounded-lg"
                onClick={handleRegister}
              >
                등록
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-600 text-lg mt-8">
            로그인이 필요합니다. 로그인 후 글쓰기를 이용할 수 있습니다.
          </div>
        )}
        {/* 모달 컴포넌트 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-1/5 shadow-lg text-center">
              <p className="mb-4 text-gray-800">{modalMessage}</p>
              <button
                className="bg-gray-800 rounded-lg text-white py-2 w-3/4"
                onClick={handleModalClose}
              >
                확인
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
