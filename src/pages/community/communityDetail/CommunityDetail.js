import React, { useEffect, useState } from "react";
import CommunityButton from "../../../components/CommunityButton";
import { useParams } from "react-router-dom";
import Profile from "../../../assets/icons/profile.svg";
import Send from "../../../assets/icons/send.svg";
import axios from "axios";
import { DOMAIN_NAME, TOKEN_NAME } from "../../../App";

export default function CommunityDetail() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null); // 게시글 데이터
  const [comments, setComments] = useState([]); // 댓글 데이터
  const [newComment, setNewComment] = useState(""); // 새로운 댓글 내용
  const [isAnonymous, setIsAnonymous] = useState(false); // 익명 여부

  // 게시글 데이터 가져오기
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await axios.get(`${DOMAIN_NAME}/board/${boardId}`, {
          headers: {
            Authorization: `Bearer ${TOKEN_NAME}`,
          },
        });
        console.log("Fetched Data:", response.data); // 데이터 구조 확인
        setBoard(response.data.board);
        setComments(response.data.board.comments || []);
      } catch (error) {
        console.error("Error fetching post detail:", error);
      }
    };
    fetchPostDetail();
  }, [boardId]);

  // 댓글 작성
  const handlePostComment = async () => {
    if (!newComment.trim()) return alert("댓글 내용을 입력하세요!");
    try {
      const response = await axios.post(
        `${DOMAIN_NAME}/board/${boardId}/comment`,
        {
          content: newComment,
          isAnonymous,
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN_NAME}`,
          },
        }
      );
      // 댓글 작성 성공 시 새로운 댓글 추가
      setComments((prev) => [...prev, response.data]);
      setNewComment(""); // 입력 필드 초기화
      setIsAnonymous(false); // 익명 상태 초기화
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  if (!board) return <div>Loading...</div>;

  return (
    <div className="flex flex-row w-full gap-[75px]">
      <div className="pl-36 p-4">
        <CommunityButton />
      </div>

      <div className="w-3/5 p-4">
        <div className="w-full border border-gray-300 rounded-lg overflow-hidden relative p-10 px-16 flex flex-col gap-6">
          <div className="h-100dvh flex justify-center flex-col gap-8">
            {/* 작성자 정보 */}
            <div className="flex justify-between">
              <div className="flex flex-row items-center gap-2.5">
                <img
                  src={board.userProfileImageUrl || Profile}
                  alt="Profile"
                  className="w-14 h-14 rounded-full"
                />
                <div className="font-semibold text-base">{board.username}</div>
              </div>
              <div className="text-gray-600 text-sm">{board.createAt}</div>
            </div>

            {/* 게시글 제목 및 내용 */}
            <div className="font-bold text-2xl">{board.title}</div>
            <div className="font-regular text-base">{board.content}</div>
          </div>

          {/* 댓글 영역 */}
          <div className="flex flex-col gap-6 rounded-2xl h-96 p-4 border border-gray-300">
            {/* 댓글 목록 */}
            <div className="w-full p-1 overflow-y-auto">
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="flex gap-4 mb-4 p-2"
                >
                  {/* 사용자 프로필 이미지 */}
                  <div className="flex-shrink-0">
                    <img
                      className="h-12 w-12 rounded-full"
                      src={comment.userProfileImageUrl}
                      alt={`${comment.username}'s profile`}
                    />
                  </div>
                  {/* 댓글 내용 */}
                  <div className="flex-1 px-4 py-2 bg-gray-100 rounded-xl w-full ">
                    {/* 댓글 상단: 사용자 이름과 작성 시간 */}
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-bold text-base text-gray-700">
                        {comment.username}
                      </div>
                      <div className="text-sm text-gray-700">{comment.createAt}</div>
                    </div>
                    {/* 댓글 내용 */}
                    <div className="text-gray-700 text-base">
                      {comment.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>



          {/* 댓글 작성 영역 */}
            <div className="w-full flex justify-between items-center p-2 rounded-lg border border-gray-300">
              <label className="flex items-center gap-2 mr-4">
                <input
                  type="checkbox"
                  className="cursor-pointer"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                <span className="text-sm">익명</span>
              </label>
              <input
                className="w-[80%] p-2 rounded-lg focus:outline-none"
                placeholder="댓글을 입력하세요"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <img
                src={Send}
                alt="Send"
                className="w-6 h-6 cursor-pointer ml-2"
                onClick={handlePostComment}
              />
            </div>
          </div>
        </div>
      </div>
  );
}
