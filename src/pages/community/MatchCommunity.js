import React, { useState } from 'react';
import CommunityButton from "../../components/CommunityButton";
import Glasses from "../../assets/icons/glasses.svg";
import PageNumber from "../../components/PageNumber";

// 더미 데이터 배열 생성
const contentData = [
    { title: '와 10번 누구야', author: '정찬우', date: '2024-10-05', comments: '3' },
    { title: '정찬우 드리블 뭐야', author: '송규원', date: '2024-10-05', comments: '3' },
    { title: '북악리그 화이팅', author: '박수연', date: '2024-10-05', comments: '3' },
    { title: '슈팅 화이팅!', author: '이정욱', date: '2024-10-05', comments: '3' },
    { title: '오늘 경기 너무 재밌었다~', author: '유태근', date: '2024-10-05', comments: '3' },
    { title: '다음주 경기에 정찬우 선수 나오나요?', author: '안선영', date: '2024-10-05', comments: '3' },
    { title: '나도 내년에 북악리그 참여하고 싶다..', author: '정찬우', date: '2024-10-05', comments: '3' },
    { title: '화려한 경기!', author: '김지훈', date: '2024-10-06', comments: '3' },
    { title: '경기 후의 인터뷰는 언제 올라오나요?', author: '최민수', date: '2024-10-06', comments: '3' },
    { title: '관중들의 반응은 정말 대단했어요!', author: '윤정호', date: '2024-10-06', comments: '3' },
    { title: '추가된 게시글1', author: '김현우', date: '2024-10-07', comments: '3' },
    { title: '추가된 게시글2', author: '박지민', date: '2024-10-07', comments: '3' },
    { title: '다음주 경기에 정찬우 선수 나오나요?', author: '안선영', date: '2024-10-05', comments: '3' },
    { title: '나도 내년에 북악리그 참여하고 싶다..', author: '정찬우', date: '2024-10-05', comments: '3' },
    { title: '화려한 경기!', author: '김지훈', date: '2024-10-06', comments: '3' },
    { title: '경기 후의 인터뷰는 언제 올라오나요?', author: '최민수', date: '2024-10-06', comments: '3' },
    { title: '관중들의 반응은 정말 대단했어요!', author: '윤정호', date: '2024-10-06', comments: '3' },
    { title: '추가된 게시글1', author: '김현우', date: '2024-10-07', comments: '3' },
    { title: '추가된 게시글2', author: '박지민', date: '2024-10-07', comments: '3' },
    // 더 많은 데이터 추가 가능
];

const ITEMS_PER_PAGE = 10;

export default function MatchCommunity() {
    const [currentPage, setCurrentPage] = useState(1);
    const [startPage, setStartPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(contentData);
    // 페이지에 따른 데이터 잘라내기
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentData = filteredData.slice(startIndex, endIndex);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

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

    // 검색어에 따른 데이터 필터링 함수
    const handleSearch = () => {
        const filtered = contentData.filter(item =>
          item.title.includes(searchTerm) // 제목에 검색어 포함 여부 확인
        );
        setFilteredData(filtered);
        setCurrentPage(1); // 검색 결과가 갱신될 때 페이지를 첫 페이지로 초기화
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
              <div className="text-xl font-semibold mb-4 border border-gray-300 rounded-lg p-2 px-8">
                  연습 상대 게시판
              </div>

              {/* 검색 영역 */}
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
                          <img src={Glasses} alt="Glasses Icon" className="w-5 h-5"/>
                      </button>
                  </div>
              </div>

              {/* 게시글 테이블 */}
              <div className="w-full border border-gray-300 rounded-lg overflow-hidden px-6 ">
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
                      {currentData.map((item, index) => (
                        <tr key={index} className="border-b">
                            <td className="p-3">{item.title}</td>
                            <td className="p-3">{item.author}</td>
                            <td className="p-3">{item.date}</td>
                            <td className="p-3 text-center">{item.comments}</td>
                        </tr>
                      ))}
                      </tbody>
                  </table>
              </div>

              {/* 페이지네이션 컴포넌트 */}
              <PageNumber
                currentPage={currentPage}
                startPage={startPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onNextClick={handleLinkClick}
                onPrevClick={handleReverseLinkClick}
              />
          </div>
      </div>
    );
}
