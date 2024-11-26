import React, {useCallback, useEffect, useRef, useState} from "react";
import CommunityButton from "../../../components/community/CommunityButton";
import {useParams} from "react-router-dom";
import axios from "axios";
import {CgProfile} from "react-icons/cg";
import Send from "../../../assets/icons/send.svg";
import {DOMAIN_NAME, TOKEN_NAME} from "../../../App";

export default function CommunityDetail() {
  const {boardId} = useParams();
  const [board, setBoard] = useState(null); // 게시글 데이터
  const [comments, setComments] = useState([]); // 댓글 데이터
  const [newComment, setNewComment] = useState(""); // 새로운 댓글 내용
  const [isAnonymous, setIsAnonymous] = useState(false); // 익명 여부
  const commentsRef = useRef(null); // 댓글 영역 참조
  const lastCommentRef = useRef(null); // 최신 댓글 참조
  const [isSubmitting, setIsSubmitting] = useState(false); // 댓글 중복 제출 방지

  // 게시글 데이터 가져오기
  const fetchPostDetail = useCallback(async () => {
    try {
      const response = await axios.get(`${DOMAIN_NAME}/board/${boardId}`, {
        headers: {
          Authorization: `Bearer ${TOKEN_NAME}`,
        },
      });
      setBoard(response.data.board);
      setComments(response.data.board.comments);
    } catch (error) {
      console.error("Error fetching post detail:", error);
    }
  }, [boardId]); // boardId를 의존성으로 추가

  // 컴포넌트가 처음 렌더링되거나 boardId가 변경될 때 fetchPostDetail을 호출함
  useEffect(() => {
    fetchPostDetail();
  }, [fetchPostDetail]); // fetchPostDetail을 의존성으로 추가

  // 페이지 새로 들어가면 최신 댓글로 이동
  useEffect(() => {
    if (lastCommentRef.current) {
      lastCommentRef.current.scrollIntoView({block: "nearest"});
    }
  }, [comments]);

  // 댓글 작성 후 부드럽게 스크롤
  const scrollToBottomSmooth = () => {
    if (commentsRef.current) {
      commentsRef.current.scrollTo({
        top: commentsRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }


  // 댓글 작성
  const handlePostComment = async () => {
    if (isSubmitting || !newComment.trim()) return;

    setIsSubmitting(true); // 중복 제출 방지
    try {
      await axios.post(
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
      setNewComment(""); // 댓글 입력 창 초기화
      await fetchPostDetail(); // 댓글 새로고침
      scrollToBottomSmooth(); // 부드럽게 스크롤
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!board) return <div>Loading...</div>;

  return (
    <div className="flex flex-row w-full gap-[75px]">
      <div className="pl-36 p-4">
        <CommunityButton/>
      </div>

      <div className="w-3/5 p-4">
        <div
          className="w-full border border-gray-300 rounded-lg overflow-hidden relative p-10 px-16 flex flex-col gap-6"
        >
          <div className="h-100dvh flex justify-center flex-col gap-8">
            {/* 작성자 정보 */}
            <div className="flex justify-between">
              <div className="flex flex-row items-center gap-2.5">
                <img
                  src={board.userProfileImageUrl || CgProfile}
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
          <div
            ref={commentsRef}
            className="flex flex-col gap-6 rounded-2xl h-96 p-4 border border-gray-300 overflow-y-auto"
          >
            {/* 댓글 목록 */}
            {comments.map((comment, index) => (
              <div
                key={index}
                ref={index === comments.length - 1 ? lastCommentRef : null} // 최신 댓글에 ref 추가
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
                <div className="flex-1 px-4 py-2 bg-gray-100 rounded-xl w-full">
                  {/* 댓글 상단: 사용자 이름과 작성 시간 */}
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-bold text-base text-gray-700">
                      {comment.username}
                    </div>
                    <div className="text-sm text-gray-700">
                      {comment.createAt}
                    </div>
                  </div>
                  {/* 댓글 내용 */}
                  <div
                    className="text-gray-700 text-base"
                    style={{
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {comment.content}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 댓글 작성 영역 */}
          <div className="flex items-center w-full p-1 px-2.5 rounded-xl bg-gray-100 mt-4 border border-gray-400">
            <div className="flex items-center">
              <input
                id="checked-checkbox"
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-400 rounded checked:bg-gray-500 focus:ring-0 dark:bg-gray-500 dark:border-gray-500"
              />
              <label
                htmlFor="checked-checkbox"
                className="ms-2 text-sm font-medium text-gray-400"
              >
                익명
              </label>
            </div>
            <div className="ml-3 h-6 border-l-2 border-gray-300"></div>
            <input
              type="text"
              placeholder="댓글을 입력하세요"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // 기본 동작 방지
                  handlePostComment();
                }
              }}
              className="flex-1 text-sm outline-none px-2 py-2 bg-gray-100"
            />
            <button
              onClick={handlePostComment}
              className="flex items-center justify-center w-8 h-8 "
            >
              <img src={Send} alt="send" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
