import React, { useState } from 'react';
import CommunityButton from "../../components/CommunityButton";
import PageNumber from "../../components/PageNumber";
import Glasses from "../../assets/icons/glasses.svg";
import Link from "../../assets/icons/link.svg";
import reverseLink from "../../assets/icons/reverseLink.svg";

// 더미 데이터 배열 생성
const contentData = [
    { title: '와 10번 누구야', author: '정찬우', date: '2024-10-05', comments: '댓글' },
    { title: '정찬우 드리블 뭐야', author: '송규원', date: '2024-10-05', comments: '댓글' },
    { title: '북악리그 화이팅', author: '박수연', date: '2024-10-05', comments: '댓글' },
    { title: '슈팅 화이팅!', author: '이정욱', date: '2024-10-05', comments: '댓글' },
    { title: '오늘 경기 너무 재밌었다~', author: '유태근', date: '2024-10-05', comments: '댓글' },
    { title: '다음주 경기에 정찬우 선수 나오나요?', author: '안선영', date: '2024-10-05', comments: '댓글' },
    { title: '나도 내년에 북악리그 참여하고 싶다..', author: '정찬우', date: '2024-10-05', comments: '댓글' },
    { title: '화려한 경기!', author: '김지훈', date: '2024-10-06', comments: '댓글' },
    { title: '경기 후의 인터뷰는 언제 올라오나요?', author: '최민수', date: '2024-10-06', comments: '댓글' },
    { title: '관중들의 반응은 정말 대단했어요!', author: '윤정호', date: '2024-10-06', comments: '댓글' },
    { title: '추가된 게시글1', author: '김현우', date: '2024-10-07', comments: '댓글' },
    { title: '추가된 게시글2', author: '박지민', date: '2024-10-07', comments: '댓글' },
    { title: '다음주 경기에 정찬우 선수 나오나요?', author: '안선영', date: '2024-10-05', comments: '댓글' },
    { title: '나도 내년에 북악리그 참여하고 싶다..', author: '정찬우', date: '2024-10-05', comments: '댓글' },
    { title: '화려한 경기!', author: '김지훈', date: '2024-10-06', comments: '댓글' },
    { title: '경기 후의 인터뷰는 언제 올라오나요?', author: '최민수', date: '2024-10-06', comments: '댓글' },
    { title: '관중들의 반응은 정말 대단했어요!', author: '윤정호', date: '2024-10-06', comments: '댓글' },
    { title: '추가된 게시글1', author: '김현우', date: '2024-10-07', comments: '댓글' },
    { title: '추가된 게시글2', author: '박지민', date: '2024-10-07', comments: '댓글' },
    // 더 많은 데이터 추가 가능
];

const ITEMS_PER_PAGE = 10;

export default function Community() {
    const [currentPage, setCurrentPage] = useState(1);
    const [startPage, setStartPage] = useState(1);

    // 페이지에 따른 데이터 잘라내기
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentData = contentData.slice(startIndex, endIndex);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(contentData.length / ITEMS_PER_PAGE);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleLinkClick = () => {
        if (startPage + 10 <= totalPages) {
            setStartPage((prevStartPage) => prevStartPage + 10);
        }
    };

    const handleReverseLinkClick = () => {
        if (startPage > 1) {
            setStartPage((prevStartPage) => prevStartPage - 10);
        }
    };

    return (
      <div className="flex flex-row w-full gap-[75px]">
          {/* 첫 번째 영역: CommunityButton */}
          <div className="pl-36 p-4">
              <CommunityButton />
          </div>

          {/* 두 번째 영역: 게시글 내용 */}
          <div className="w-3/5 p-4">
              {/* 자유 게시판 제목 */}
              <div className="text-xl font-normal mb-4 border border-gray-300 rounded-lg p-2">
                  자유 게시판
              </div>

              {/* 검색 영역 */}
              <div className="flex justify-end">
                  <div className="w-[30%] relative mb-4">
                      <input
                        type="text"
                        placeholder="게시글 검색"
                        className="border border-gray-300 rounded-lg p-2 w-full pl-4 pr-10"
                      />
                      <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <img src={Glasses} alt="Glasses Icon" className="w-5 h-5" />
                      </button>
                  </div>
              </div>

              {/* 게시글 테이블 */}
              <div className="w-full border border-gray-300 rounded-lg overflow-hidden">
                  <table className="table-auto w-full text-left">
                      <thead className="bg-gray-100 border-b">
                      <tr>
                          <th className="p-3">제목</th>
                          <th className="p-3">작성자</th>
                          <th className="p-3">작성일</th>
                          <th className="p-3">댓글</th>
                      </tr>
                      </thead>
                      <tbody>
                      {currentData.map((item, index) => (
                        <tr key={index} className="border-b">
                            <td className="p-3">{item.title}</td>
                            <td className="p-3">{item.author}</td>
                            <td className="p-3">{item.date}</td>
                            <td className="p-3">{item.comments}</td>
                        </tr>
                      ))}
                      </tbody>
                  </table>
              </div>

              {/* 페이지네이션 버튼 */}
              <div className="w-full sm:w-3/4 md:w-full p-1 border border-gray-300 rounded-lg flex flex-wrap justify-center space-x-2 mt-12 mb-24">
                  <img src={reverseLink} alt="Reverse Link icon" onClick={handleReverseLinkClick} className="cursor-pointer" />
                  {Array.from({ length: Math.min(10, totalPages - startPage + 1) }, (_, i) => startPage + i).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border-none flex items-center rounded-lg ${
                        currentPage === page ? 'bg-sky-600 text-white' : 'bg-white text-black'
                      }`}
                    >
                        {page}
                    </button>
                  ))}
                  <img src={Link} alt="Link icon" onClick={handleLinkClick} className="cursor-pointer" />
              </div>
          </div>
      </div>
    );
}