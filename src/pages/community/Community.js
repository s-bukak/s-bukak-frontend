import React from 'react';
import CommunityButton from "../../components/CommunityButton";
import Glasses from "../../assets/icons/glasses.svg";

// 더미 데이터 배열 생성
const dummyData = [
    { title: '와 10번 누구야', author: '정찬우', date: '2024-10-05', comments: '댓글' },
    { title: '정찬우 드리블 뭐야', author: '작성자', date: '2024-10-05', comments: '댓글' },
    { title: '정찬우 드리블 뭐야', author: '작성자', date: '2024-10-05', comments: '댓글' },
    { title: '정찬우 드리블 뭐야', author: '작성자', date: '2024-10-05', comments: '댓글' },
    { title: '정찬우 드리블 뭐야', author: '작성자', date: '2024-10-05', comments: '댓글' },
    { title: '정찬우 드리블 뭐야', author: '작성자', date: '2024-10-05', comments: '댓글' },
    { title: '정찬우 드리블 뭐야', author: '작성자', date: '2024-10-05', comments: '댓글' },
    { title: '제목 3', author: '작성자', date: '2024-10-05', comments: '댓글' },
    { title: '제목 4', author: '작성자', date: '2024-10-05', comments: '댓글' },
    { title: '제목 5', author: '작성자', date: '2024-10-05', comments: '댓글' },
    // 더 많은 데이터 추가 가능
];

export default function Community() {
    return (
        <div className="flex flex-row w-full gap-[75px]">
            {/* 첫 번째 영역: CommunityButton */}
            <div className="pl-36 p-4">
                <CommunityButton />
            </div>

            {/* 두 번째 영역: 게시글 내용 */}
            <div className="w-3/5 p-4">
                {/* 자유 게시판 제목 */}
                <div className="text-2xl font-bold mb-4 border border-gray-300 rounded-lg pl-4">
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
                            <img src={Glasses} alt="Glasses Icon" className="w-5 h-5"/>
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
                        {dummyData.map((item, index) => (
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
            </div>
        </div>
    );
}
