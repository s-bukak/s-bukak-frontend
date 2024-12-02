import React, {useState, useEffect, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {useRecoilValue} from 'recoil';
import CommunityButton from "../../components/community/CommunityButton";
import PageNumber from "../../components/PageNumber";
import {FaMagnifyingGlass} from "react-icons/fa6";
import axiosInstance from "../../utils/axiosInstance";
import {currentTabState} from '../../state/communityTabState'; // Recoil 상태 가져오기

const ITEMS_PER_PAGE = 10;

export default function Community() {
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
  const [filteredData, setFilteredData] = useState([]); // API에서 받아온 데이터 상태
  const navigate = useNavigate();

  const currentTab = useRecoilValue(currentTabState); // 현재 활성화된 탭 가져오기

  // 상세 페이지로 이동
  const handleRowClick = (boardId) => {
    navigate(`/community-detail/${boardId}`);
  };

  // fetchBoards 함수
  const fetchBoards = useCallback(async () => {
    try {
      let params = {};

      switch (currentTab) {
        case 'free-community':
          params = {
            boardType: "FREE", // 자유 게시판 타입
            query: searchTerm,
            myBoardsOnly: false,
          };
          break;
        case 'practice-community':
          params = {
            boardType: "PRACTICE", // 연습 상대 게시판 타입
            query: searchTerm,
            myBoardsOnly: false,
          };
          break;
        case 'my-wrote':
          params = {
            boardType: "MY_POST", // 연습 상대 게시판 타입
            query: searchTerm,
          };
          break;
        case 'my-comment':
          params = {
            boardType: "MY_COMMENT",   // 게시판 타입을 MY_COMMENT로 고정
            query: searchTerm,
          };
          break;
        default:
          return;
      }

      const response = await axiosInstance.get(`boards`, {params});

      const formattedData = response.data.boards.map((board) => ({
        boardId: board.boardId,
        title: board.title,
        author: board.username,
        createAt: board.createAt,
        comments: board.comments.length,
      }));
      setFilteredData(formattedData);
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  }, [searchTerm, currentTab]); // searchTerm과 currentTab을 종속성 배열에 포함

  // fetchBoards 호출
  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchTerm(searchTerm.trim());
  };

  return (
    <div className="flex flex-row w-full gap-[75px]">
      {/* 좌측 버튼 */}
      <div className="pl-36 p-4">
        <CommunityButton/>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="w-3/5 p-4">
        {/* 제목 */}
        <div className="text-xl font-semibold mb-4 border border-gray-300 rounded-lg p-2 px-8">
          {currentTab === 'free-community'
            ? '자유 게시판'
            : currentTab === 'practice-community'
              ? '연습 상대 게시판'
              : currentTab === 'my-wrote'
                ? '내가 쓴 글'
                : '댓글 단 글'}
        </div>

        {/* 검색 */}
        <div className="flex justify-end">
          <div className="w-[30%] relative mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="게시글 검색"
              className="border border-gray-300 rounded-lg p-2 w-full pl-4 pr-10"
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300"
              onClick={handleSearch}
            >
              <FaMagnifyingGlass/>
            </button>
          </div>
        </div>

        {/* 데이터 테이블 */}
        {filteredData.length > 0 ? (
          <>
            <div className="w-full border border-gray-300 rounded-lg px-6">
              <table className="table-fixed w-full text-center">
                <thead className="border-b-2 border-gray-400 font-bold">
                <tr>
                  <th className="p-3 text-center w-1/4">제목</th>
                  <th className="p-3 text-center w-1/3">작성자</th>
                  <th className="p-3 text-center">작성일</th>
                  <th className="p-3 text-center">댓글</th>
                </tr>
                </thead>
                <tbody>
                {filteredData
                  .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                  .map((item, index) => (
                    <tr
                      key={index}
                      className="border-b cursor-pointer hover:bg-gray-100"
                      onClick={() => handleRowClick(item.boardId)}
                    >
                      <td className="p-3 text-center">{item.title}</td>
                      <td className="p-3 text-center">{item.author}</td>
                      <td className="p-3 text-center">{item.createAt}</td>
                      <td className="p-3 text-center">{item.comments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 페이지 번호 */}
            <PageNumber
              currentPage={currentPage}
              startPage={startPage}
              totalPages={Math.ceil(filteredData.length / ITEMS_PER_PAGE)}
              onPageChange={setCurrentPage}
              onNextClick={() => setStartPage((prev) => prev + 10)}
              onPrevClick={() => setStartPage((prev) => (prev > 1 ? prev - 10 : 1))}
            />
          </>
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-500">
            등록된 게시글이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
