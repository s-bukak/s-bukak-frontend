import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CommunityButton from "../../components/CommunityButton";
import PageNumber from "../../components/PageNumber";
import Glasses from "../../assets/icons/glasses.svg";
import { DOMAIN_NAME, TOKEN_NAME } from "../../App";

const ITEMS_PER_PAGE = 10;

export default function FreeCommunity() {
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
  const [filteredData, setFilteredData] = useState([]); // API에서 받아온 데이터 상태
  const navigate = useNavigate();

  // 상세 페이지로 이동
  const handleRowClick = (boardId) => {
    navigate(`/community-detail/${boardId}`);
  };
  // fetchBoards 함수를 useCallback으로 감싸기
  const fetchBoards = useCallback(async () => {
    try {
      const response = await axios.get(`${DOMAIN_NAME}/boards`, {
        headers: {
          Authorization: `Bearer ${TOKEN_NAME}`
        },
        params: {
          boardType: "FREE",   // 게시판 타입을 FREE로 고정
          query: searchTerm,   // 검색어를 API 요청의 파라미터로 전달
          myBoardsOnly: false   // 사용자의 게시글만 보기 옵션 활성화
        }
      });

      const formattedData = response.data.boards.map(board => ({
        boardId : board.boardId,
        title: board.title,
        author: board.username,
        createAt: board.createAt,
        comments: board.comments.length
      }));
      setFilteredData(formattedData);
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  }, [searchTerm]);  // searchTerm과 token을 종속성 배열에 포함

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchTerm(searchTerm.trim());
  };

  return (
    <div className="flex flex-row w-full gap-[75px]">
      <div className="pl-36 p-4">
        <CommunityButton />
      </div>

      <div className="w-3/5 p-4">
        <div className="text-xl font-semibold mb-4 border border-gray-300 rounded-lg p-2 px-8">
          자유 게시판
        </div>

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
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={handleSearch}
            >
              <img src={Glasses} alt="Glasses Icon" className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="w-full border border-gray-300 rounded-lg overflow-hidden px-6">
          <table className="table-auto w-full text-left">
            <thead className="border-b-2 border-gray-400 font-bold">
            <tr>
              <th className="p-3">제목</th>
              <th className="p-3">작성자</th>
              <th className="p-3">작성일</th>
              <th className="p-3 text-center">댓글</th>
            </tr>
            </thead>
            <tbody>
            {filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((item, index) => (
              <tr
                key={index}
                className="border-b cursor-pointer hover:bg-gray-100"
                onClick={() => handleRowClick(item.boardId)}>
                <td className="p-3">{item.title}</td>
                <td className="p-3">{item.author}</td>
                <td className="p-3">{item.createAt}</td>
                <td className="p-3 text-center">{item.comments}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>

        <PageNumber
          currentPage={currentPage}
          startPage={startPage}
          totalPages={Math.ceil(filteredData.length / ITEMS_PER_PAGE)}
          onPageChange={setCurrentPage}
          onNextClick={() => setStartPage((prev) => prev + 10)}
          onPrevClick={() => setStartPage((prev) => prev - 10)}
        />
      </div>
    </div>
  );
}
