import React, {useCallback, useEffect, useState} from 'react';
import {useRecoilState, useRecoilValue} from 'recoil';
import {useNavigate} from 'react-router-dom';
import CommunityButton from '../../components/community/CommunityButton';
import PageNumber from '../../components/PageNumber';
import {FaMagnifyingGlass} from 'react-icons/fa6';
import axiosInstance from '../../utils/axiosInstance';
import {activeTabState, currentTabState} from '../../state/communityTabState';

const ITEMS_PER_PAGE = 10;

export default function Community() {
    const [currentPage, setCurrentPage] = useState(1);
    const [startPage, setStartPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [currentTab, setCurrentTab] = useRecoilState(currentTabState);
    const activeTab = useRecoilValue(activeTabState);
    const navigate = useNavigate();


    useEffect(() => {
        console.log(activeTab);
        console.log(currentTab);
        if (activeTab === '게시판 정보') {
            setCurrentTab('/free-community'); // 초기화 로직
        } else if (activeTab === '나의활동') {
            setCurrentTab('/my-wrote');
        }
    }, [activeTab, setCurrentTab]);

    // fetchBoards 함수
    const fetchBoards = useCallback(async () => {
        try {
            let params = {};
            switch (currentTab) {
                case '/free-community':
                    params = {boardType: 'FREE', query: searchTerm, myBoardsOnly: false};
                    break;
                case '/practice-community':
                    params = {boardType: 'PRACTICE', query: searchTerm, myBoardsOnly: false};
                    break;
                case '/my-wrote':
                    params = {boardType: 'MY_POST', query: searchTerm};
                    break;
                case '/my-comment':
                    params = {boardType: 'MY_COMMENT', query: searchTerm};
                    break;
                default:
                    return;
            }

            const response = await axiosInstance.get('boards', {params});
            const formattedData = response.data.boards.map((board) => ({
                boardId: board.boardId,
                title: board.title,
                author: board.username,
                createAt: board.createAt,
                comments: board.comments.length,
            }));
            setFilteredData(formattedData);
        } catch (error) {
            console.error('Error fetching boards:', error);
        }
    }, [searchTerm, currentTab]);

    useEffect(() => {
        if (currentTab) {
            fetchBoards();
        }
    }, [currentTab, fetchBoards]);


    // 상세 페이지로 이동
    const handleRowClick = (boardId) => {
        navigate(`/community/detail/${boardId}`); // 동적 라우팅으로 이동
    };

    // 글쓰기 페이지로 이동
    const handleWriteClick = () => {
        navigate('/community/write'); // 글쓰기 페이지로 이동
    };


    const handleSearch = () => {
        setCurrentPage(1);
        setSearchTerm(searchInput.trim());
    };

    return (
        <div className="flex flex-row w-full my-20 justify-center gap-8">
            <CommunityButton onWriteClick={handleWriteClick}/>

            <div className="w-3/5 flex flex-col gap-4">
                {/* 제목 */}
                <div className="font-semibold border border-gray-300 rounded-lg flex items-center h-12 px-8">
                    {currentTab === '/free-community'
                        ? '자유 게시판'
                        : currentTab === '/practice-community'
                            ? '연습 상대 게시판'
                            : currentTab === '/my-wrote'
                                ? '내가 쓴 글'
                                : '댓글 단 글'}
                </div>

                {/* 데이터 테이블 */}
                {filteredData.length > 0 ? (
                    <>
                        <div className="w-full border border-gray-300 rounded-lg px-4 py-2">
                            <table className="table-fixed w-full text-center">
                                <thead className="border-b-2 border-gray-400 font-bold">
                                <tr>
                                    <th className="p-3 text-left w-[30%]">제목</th>
                                    <th className="p-3 text-center w-[30%]">작성자</th>
                                    <th className="p-3 text-center">작성일</th>
                                    <th className="p-3 text-center">댓글</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredData
                                    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                                    .map((item, index, array) => (
                                        <tr
                                            key={index}
                                            className={`cursor-pointer hover:bg-gray-100 ${
                                                index === array.length - 1 ? '' : 'border-b'
                                            }`}
                                            onClick={() => handleRowClick(item.boardId)}
                                        >
                                            <td className="p-3 text-left">
                                                {item.title.length > 15 ? `${item.title.slice(0, 15)}...` : item.title}
                                            </td>
                                            <td className="p-3 text-center">{item.author}</td>
                                            <td className="p-3 text-center">
                                                {item.createAt.split(' ')[0]}
                                            </td>
                                            <td className="p-3 text-center">{item.comments}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* 검색 */}
                        <div className="justify-center flex">
                            <div className="w-[40%] relative">
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="제목이나 본문 내용을 검색해보세요"
                                    className="border-b border-gray-300 p-2 w-full pl-4 pr-10 focus:outline-none"
                                />
                                <button
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300"
                                    onClick={handleSearch}
                                >
                                    <FaMagnifyingGlass/>
                                </button>
                            </div>
                        </div>

                        {/* 페이지 번호 */}
                        <PageNumber
                            currentPage={currentPage}
                            startPage={startPage}
                            totalPages={Math.ceil(filteredData.length / ITEMS_PER_PAGE)}
                            onPageChange={(page) => {
                                setCurrentPage(page);
                                setStartPage(Math.floor((page - 1) / 10) * 10 + 1); // 그룹 페이지 갱신
                            }}
                            onNextClick={() => {
                                if (currentPage < Math.ceil(filteredData.length / ITEMS_PER_PAGE)) {
                                    setCurrentPage((prev) => prev + 1);
                                    if ((currentPage - startPage + 1) % 10 === 0) {
                                        setStartPage((prev) => prev + 10);
                                    }
                                }
                            }}
                            onPrevClick={() => {
                                if (currentPage > 1) {
                                    setCurrentPage((prev) => prev - 1);
                                    if ((currentPage - startPage) % 10 === 0) {
                                        setStartPage((prev) => (prev > 1 ? prev - 10 : 1));
                                    }
                                }
                            }}
                            onNextGroupClick={() => {
                                const nextStartPage = startPage + 10;
                                if (nextStartPage <= Math.ceil(filteredData.length / ITEMS_PER_PAGE)) {
                                    setStartPage(nextStartPage);
                                    setCurrentPage(nextStartPage);
                                }
                            }}
                            onPrevGroupClick={() => {
                                const prevStartPage = startPage - 10;
                                if (prevStartPage >= 1) {
                                    setStartPage(prevStartPage);
                                    setCurrentPage(prevStartPage);
                                }
                            }}
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
