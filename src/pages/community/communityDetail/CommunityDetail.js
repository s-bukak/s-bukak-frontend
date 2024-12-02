import React, {useCallback, useEffect, useRef, useState} from "react";
import CommunityButton from "../../../components/community/CommunityButton";
import {useParams, useNavigate} from "react-router-dom";
import {CgProfile} from "react-icons/cg";
import {FaTrash} from "react-icons/fa6";
import Send from "../../../assets/icons/send.svg";
import axiosInstance from "../../../utils/axiosInstance";
import {isTokenValid} from "../../../utils/token";

export default function CommunityDetail() {
  const {boardId} = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null); // 게시글 데이터
  const [comments, setComments] = useState([]); // 댓글 데이터
  const [newComment, setNewComment] = useState(""); // 새로운 댓글 내용
  const [isAnonymous, setIsAnonymous] = useState(false); // 익명 여부
  const commentsRef = useRef(null); // 댓글 영역 참조
  const lastCommentRef = useRef(null); // 최신 댓글 참조
  const [isSubmitting, setIsSubmitting] = useState(false); // 댓글 중복 제출 방지
  const isLoggedIn = isTokenValid(); // 로그인 여부 확인

  // 게시글 데이터 가져오기
  const fetchPostDetail = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`board/${boardId}`);
      setBoard(response.data.board);
      setComments(response.data.board.comments);
    } catch (error) {
      console.error("Error fetching post detail:", error);
    }
  }, [boardId]);

  // 게시글 삭제
  const handleDeleteBoard = async () => {
    const confirmDelete = window.confirm("정말로 이 게시글을 삭제하시겠습니까?");
    if (!confirmDelete) return;
    try {
      await axiosInstance.delete(`board/${boardId}`);
      alert("게시글이 삭제되었습니다.");
      navigate("/community"); // 삭제 후 커뮤니티 메인으로 리다이렉트
    } catch (error) {
      console.error("Error deleting board:", error);
      alert("내 게시글만 삭제 가능합니다!");
    }
  };

  // 컴포넌트가 처음 렌더링되거나 boardId가 변경될 때 fetchPostDetail을 호출함
  useEffect(() => {
    fetchPostDetail();
  }, [fetchPostDetail]);

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
  };

  // 댓글 작성
  const handlePostComment = async () => {
    if (!isLoggedIn) {
      alert("댓글을 작성하려면 로그인이 필요합니다.");
      return;
    }

    if (isSubmitting || !newComment.trim()) return;

    setIsSubmitting(true); // 중복 제출 방지
    try {
      await axiosInstance.post(`/board/${boardId}/comment`, {
        content: newComment,
        isAnonymous,
      });
      setNewComment(""); // 댓글 입력 창 초기화
      await fetchPostDetail(); // 댓글 새로고침
      scrollToBottomSmooth(); // 부드럽게 스크롤
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!board) {
    return <div>Loading...</div>; // 데이터가 로드되지 않았을 때 로딩 상태 표시
  }

  return (
    <div className="flex flex-row w-full gap-[75px]">
      <div className="pl-36 p-4">
        <CommunityButton/>
      </div>

      <div className="w-3/5 p-4">
        <div
          className="w-full border border-gray-300 rounded-lg overflow-hidden relative p-10 px-16 flex flex-col gap-6">
          {/* 게시글 정보 */}
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
                <div className="text-gray-400 cursor-pointer" onClick={handleDeleteBoard}>
                  <FaTrash />
                </div>
            </div>

            {/* 게시글 제목 및 내용 */}
            <div className="font-bold text-2xl">{board.title}</div>
            <div className="font-regular text-base">{board.content}</div>
            <div className="text-gray-600 text-sm text-end">{board.createAt}</div>
          </div>

          {/* 댓글 영역 */}
          {comments.length > 0 ? (
            <div
              ref={commentsRef}
              className="flex flex-col gap-1 rounded-2xl h-96 p-4 border border-gray-300 overflow-y-auto "
            >
              {comments.map((comment, index) => (
                <div
                  key={index}
                  ref={index === comments.length - 1 ? lastCommentRef : null} // 최신 댓글에 ref 추가
                  className="flex gap-4 mb-4 p-2"
                >
                  <div className="flex-shrink-0">
                    <img
                      className="h-12 w-12 rounded-full"
                      src={comment.userProfileImageUrl}
                      alt={`${comment.username}'s profile`}
                    />
                  </div>
                  <div className="flex-1 px-4 py-2 bg-gray-100 rounded-xl w-full">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-bold text-base text-gray-700">
                        {comment.username}
                      </div>
                      <div className="text-sm text-gray-700">
                        {comment.createAt}
                      </div>
                    </div>
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
          ) : (
            <div className="rounded-2xl h-96 p-4 border border-gray-300 flex justify-center items-center text-gray-500">
              댓글이 없습니다. 댓글을 남겨보세요!
            </div>
          )}
          {/* 댓글 작성 영역 */}
          <div className="flex items-center w-full p-1 px-2.5 rounded-xl bg-gray-100 mt-4 border border-gray-300">
            <div className="flex items-center">
              <input
                id="checked-checkbox"
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                disabled={!isLoggedIn} // 로그인하지 않은 경우 체크박스 비활성화
                className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-400 rounded checked:bg-gray-500 focus:ring-0 dark:bg-gray-500 dark:border-gray-500"
              />
              <label
                htmlFor="checked-checkbox"
                className={`ms-2 text-sm font-medium ${isLoggedIn ? "text-gray-400" : "text-gray-400"}`}
              >
                익명
              </label>
            </div>
            <div className="ml-3 h-6 border-l-2 border-gray-300"></div>
            <input
              type="text"
              placeholder={isLoggedIn ? "댓글을 입력하세요" : "로그인이 필요한 기능입니다."}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && isLoggedIn) { // 로그인한 경우만 Enter로 댓글 작성 가능
                  e.preventDefault();
                  handlePostComment();
                }
              }}
              disabled={!isLoggedIn} // 로그인하지 않은 경우 입력창 비활성화
              className={`flex-1 text-sm outline-none px-2 py-2 ${
                isLoggedIn ? "bg-gray-100" : "bg-gray-100"
              }`}
            />
            <button
              onClick={handlePostComment}
              disabled={!isLoggedIn} // 로그인하지 않은 경우 버튼 비활성화
              className="flex items-center justify-center w-8 h-8 disabled:opacity-50"
            >
              <img src={Send} alt="send"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
