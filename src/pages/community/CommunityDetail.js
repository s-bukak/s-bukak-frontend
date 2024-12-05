import React, {useCallback, useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {CgProfile} from "react-icons/cg";
import {FaTrash} from "react-icons/fa6";
import Send from "../../assets/icons/send.svg";
import axiosInstance from "../../utils/axiosInstance";
import {getUserId, isTokenValid} from "../../utils/token";
import CommunityButton from "../../components/community/CommunityButton"; // getUserId 추가

export default function CommunityDetail() {
    const navigate = useNavigate();
    const {boardId} = useParams(); // URL에서 boardId 가져오기
    const [board, setBoard] = useState(null); // 게시글 데이터
    const [comments, setComments] = useState([]); // 댓글 데이터
    const [newComment, setNewComment] = useState(""); // 새로운 댓글 내용
    const [isAnonymous, setIsAnonymous] = useState(false); // 익명 여부
    const [showDeleteModal, setShowDeleteModal] = useState(false); // 삭제 확인 모달 상태
    const commentsRef = useRef(null); // 댓글 영역 참조
    const lastCommentRef = useRef(null); // 최신 댓글 참조
    const [isSubmitting, setIsSubmitting] = useState(false); // 댓글 중복 제출 방지
    const isLoggedIn = isTokenValid(); // 로그인 여부 확인
    const loggedInUserId = getUserId(); // 현재 로그인한 사용자의 ID

    // 게시글 데이터 가져오기
    const fetchPostDetail = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`board/${boardId}`);
            setBoard(response.data.board); // 게시글 데이터 설정
            setComments(response.data.board.comments); // 댓글 데이터 설정
        } catch (error) {
            console.error("Error fetching post detail:", error);
        }
    }, [boardId]);

    // 댓글 삭제
    const handleDeleteComment = async (commentId) => {
        console.log("Deleting comment with ID:", commentId); // 삭제 요청 전 확인
        try {
            await axiosInstance.delete(`/comment/${commentId}`);
            setComments((prevComments) =>
                prevComments.filter((comment) => comment.commentId !== commentId)
            ); // 삭제된 댓글 제거
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    // 게시글 삭제
    const handleDeleteBoard = async () => {
        try {
            await axiosInstance.delete(`board/${boardId}`);
            navigate("/community"); // 삭제 후 커뮤니티 메인으로 리다이렉트
        } catch (error) {
            console.error("Error deleting board:", error);
        }
    };

    // 컴포넌트가 처음 렌더링되거나 boardId가 변경될 때 fetchPostDetail을 호출함
    useEffect(() => {
        fetchPostDetail();
    }, [fetchPostDetail]);

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

    // 댓글 작성 후 부드럽게 스크롤
    const scrollToBottomSmooth = () => {
        if (commentsRef.current) {
            commentsRef.current.scrollTo({
                top: commentsRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };


    if (!board) {
        return <div>Loading...</div>; // 데이터가 로드되지 않았을 때 로딩 상태 표시
    }

    return (
        <div className="flex flex-row w-full my-20 justify-center gap-8">
            <CommunityButton/>
            <div className="w-3/5 flex flex-col gap-4">
                <div
                    className="w-full border border-gray-300 rounded-lg overflow-hidden relative px-10 py-8 flex flex-col gap-4">
                    {/* 게시글 정보 */}
                    <div className="h-100dvh flex justify-center flex-col gap-4">
                        {/* 작성자 정보 */}
                        <div className="flex justify-between items-center">
                            <div className="flex flex-row items-center gap-2.5">
                                <img
                                    src={board.userProfileImageUrl || CgProfile}
                                    alt="Profile"
                                    className="w-10 rounded-full"
                                />
                                <div className="font-semibold text-base">{board.username}</div>
                            </div>
                            {/* 내가 쓴 글인 경우에만 삭제 버튼 표시 */}
                            {loggedInUserId === board.username && (
                                <div
                                    className="text-gray-400 cursor-pointer mr-1 text-xl"
                                    onClick={() => setShowDeleteModal(true)} // 모달 표시
                                >
                                    <FaTrash/>
                                </div>
                            )}
                        </div>

                        {/* 게시글 제목 및 내용 */}
                        <div className="font-bold text-2xl ml-1">{board.title}</div>
                        <div className="font-regular text-base ml-1 ">{board.content}</div>
                        <div className="text-gray-600 text-sm text-end mr-1">{board.createAt}</div>
                    </div>

                    {/* 댓글 영역 */}
                    {comments.length > 0 ? (
                        <div
                            ref={commentsRef}
                            className="flex flex-col gap-1 rounded-lg h-96 p-4 border border-gray-300 overflow-y-auto "
                        >
                            {comments.map((comment, index) => (
                                <div
                                    key={index}
                                    ref={index === comments.length - 1 ? lastCommentRef : null} // 최신 댓글에 ref 추가
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
                                                className="text-gray-700 text-sm "
                                                style={{
                                                    wordBreak: "break-word",
                                                    whiteSpace: "pre-wrap",
                                                }}
                                            >
                                                {comment.content}
                                            </div>
                                            {loggedInUserId === comment.username && (
                                                <button
                                                    className="text-xs text-gray-400 mt-2 underline"
                                                    onClick={() => handleDeleteComment(comment.commentId)}
                                                >
                                                    댓글 삭제
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            className="rounded-2xl h-96 p-4 border border-gray-300 flex justify-center items-center text-gray-500">
                            댓글이 없습니다. 댓글을 남겨보세요!
                        </div>
                    )}
                    {/* 댓글 작성 영역 */}

                    <div className="flex items-center w-full p-1 px-2.5 rounded-xl bg-gray-100 border border-gray-300 ">
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
                            className="flex items-center justify-center w-6 h-6 disabled:opacity-50"
                        >
                            <img src={Send} alt="send"/>
                        </button>
                    </div>
                    {showDeleteModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white px-6 py-5 rounded-lg shadow-lg w-[30%] flex flex-col gap-2">
                                <h2 className="text-lg font-bold">🗑️ 게시글 삭제</h2>
                                <p className="flex justify-start text-sm text-gray-800xw"> 한 번 삭제된 게시글은 복구가 불가능합니다.</p>
                                <div className="flex justify-end mt-4 gap-2">
                                    <button
                                        className="bg-gray-300 rounded-lg text-sm text-gray-800 font-bold py-1 w-[30%]"
                                        onClick={() => setShowDeleteModal(false)}
                                    >
                                        취소
                                    </button>
                                    <button
                                        className="bg-red-700 rounded-lg text-sm text-white font-bold py-1 w-[30%]"
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
                </div>
            </div>
        </div>
    );
}
