import React, {useCallback, useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {CgProfile} from "react-icons/cg";
import {FaTrash} from "react-icons/fa6";
import Send from "../../assets/icons/send.svg";
import axiosInstance from "../../utils/axiosInstance";
import {isTokenValid, getUserId} from "../../utils/token";
import CommunityButton from "../../components/community/CommunityButton";
import {decodeUserInfo} from "../../utils/UserUtils";

export default function CommunityDetail() {
  const navigate = useNavigate();
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCommentDeleteModal, setShowCommentDeleteModal] = useState(false); // 댓글 삭제 모달 상태
  const [commentToDelete, setCommentToDelete] = useState(null); // 삭제하려는 댓글 ID
  const commentsRef = useRef(null);
  const lastCommentRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLoggedIn = isTokenValid();
  const loggedInUserId = getUserId();
  const user = decodeUserInfo();
  const fetchPostDetail = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`board/${boardId}`);
      setBoard(response.data.board);
      setComments(response.data.board.comments);
    } catch (error) {
      console.error("Error fetching post detail:", error);
    }
  }, [boardId]);

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    try {
      await axiosInstance.delete(`/comment/${commentToDelete}`);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.commentId !== commentToDelete)
      );
      setCommentToDelete(null); // 삭제 대상 초기화
      setShowCommentDeleteModal(false); // 모달 닫기
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleDeleteBoard = async () => {
    try {
      await axiosInstance.delete(`board/${boardId}`);
      navigate("/community");
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  };

  useEffect(() => {
    fetchPostDetail();
  }, [fetchPostDetail]);

  // 페이지 로드 후 최신 댓글로 스크롤
  useEffect(() => {
    if (lastCommentRef.current) {
      lastCommentRef.current.scrollIntoView({
        behavior: "smooth", // 부드러운 스크롤
        block: "end", // 최신 댓글이 화면 하단에 정렬
      });    }
  }, [comments]);

  const handlePostComment = async () => {
    if (!isLoggedIn) {
      alert("댓글을 작성하려면 로그인이 필요합니다.");
      return;
    }

    if (isSubmitting || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await axiosInstance.post(`/board/${boardId}/comment`, {
        content: newComment,
        isAnonymous,
      });
      setNewComment("");
      await fetchPostDetail();
      scrollToBottomSmooth();
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToBottomSmooth = () => {
    if (commentsRef.current) {
      commentsRef.current.scrollTo({
        top: commentsRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  if (!board) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-row w-full my-20 justify-center gap-8">
      <CommunityButton />
      <div className="w-3/5 flex flex-col gap-4">
        <div className="w-full border border-gray-300 rounded-lg overflow-hidden relative px-10 py-8 flex flex-col gap-4">
          <div className="h-100dvh flex justify-center flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-row items-center gap-2.5">
                <img
                  src={board.userProfileImageUrl || CgProfile}
                  alt="Profile"
                  className="w-10 rounded-full"
                />
                <div className="font-semibold text-base">{board.username}</div>
              </div>
              {loggedInUserId === board.username && (
                <div
                  className="text-gray-400 cursor-pointer mr-1 text-xl"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <FaTrash />
                </div>
              )}
            </div>

            <div className="font-bold text-2xl ml-1">{board.title}</div>
            <div className="font-regular text-base ml-1 ">{board.content}</div>
            <div className="text-gray-600 text-sm text-end mr-1">
              {board.createAt}
            </div>
          </div>

          {comments.length > 0 ? (
            <div
              ref={commentsRef}
              className="flex flex-col gap-1 rounded-lg h-96 p-4 border border-gray-300 overflow-y-auto "
            >
              {comments.map((comment, index) => (
                <div
                  key={index}
                  ref={index === comments.length - 1 ? lastCommentRef : null}
                  className="flex gap-4 mb-4 p-2"
                >
                  <div className="flex-shrink-0">
                    <img
                      className="w-10 rounded-full"
                      src={comment.userProfileImageUrl}
                      alt={`${comment.username}'s profile`}
                    />
                  </div>
                  <div className="flex-1 px-4 py-2 bg-gray-100 rounded-xl w-full">
                    <div className="flex justify-between items-center mb-1 ">
                      <div className="font-bold text-sm text-gray-700">
                        {comment.username}
                      </div>
                      <div className="text-sm text-gray-700">
                        {comment.createAt}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-1 ">
                      <div
                        className="text-gray-700 text-sm w-5/6"
                        style={{
                          wordBreak: "break-word",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {comment.content}
                      </div>
                      {loggedInUserId === comment.username && (
                        <div className="w-1/6 flex justify-end">
                          <button
                            className="text-xs text-gray-400 mt-2 underline"
                            onClick={() => {
                              setCommentToDelete(comment.commentId);
                              setShowCommentDeleteModal(true);
                            }}
                          >
                            댓글 삭제
                          </button>
                        </div>
                      )}
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
          <div className="flex flex-row gap-4 px-6">
            <img
              src={user.userImage}
              alt="User Profile"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex items-center w-full p-1 px-2.5 rounded-xl bg-gray-100 border border-gray-300 ">
              <div className="flex items-center">
                <input
                  id="checked-checkbox"
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  disabled={!isLoggedIn}
                  className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-400 rounded checked:bg-gray-500 focus:ring-0 dark:bg-gray-500 dark:border-gray-500"
                />
                <label
                  htmlFor="checked-checkbox"
                  className={`ms-2 text-sm font-medium ${
                    isLoggedIn ? "text-gray-400" : "text-gray-400"
                  }`}
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
                  if (e.key === "Enter" && isLoggedIn) {
                    e.preventDefault();
                    handlePostComment();
                  }
                }}
                disabled={!isLoggedIn}
                className={`flex-1 text-sm outline-none px-2 py-2 ${
                  isLoggedIn ? "bg-gray-100" : "bg-gray-100"
                }`}
              />
              <button
                onClick={handlePostComment}
                disabled={!isLoggedIn}
                className="flex items-center justify-center w-6 h-6 disabled:opacity-50"
              >
                <img src={Send} alt="send"/>
              </button>
            </div>
          </div>

          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold mb-4">게시글 삭제</h2>
                <p>정말로 이 게시글을 삭제하시겠습니까?</p>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    취소
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={() => {
                      setShowDeleteModal(false);
                      handleDeleteBoard();
                    }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          )}
          {showCommentDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold mb-4">댓글 삭제</h2>
                <p>정말로 이 댓글을 삭제하시겠습니까?</p>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={() => setShowCommentDeleteModal(false)}
                  >
                    취소
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={() => handleDeleteComment()}
                  >
                  삭제
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
