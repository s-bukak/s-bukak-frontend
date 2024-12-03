import {useEffect, useRef, useState} from "react";
import {cleanbotMessage, homePlaceHolder} from "../../utils/MessageUtils";
import anonymous from "../../assets/images/anonymous.svg";
import sendIcon from "../../assets/icons/send.svg";
import userImage from "../../assets/images/userImage.jpg"
import useTeamMsg from "../../hooks/useTeamMsg";
import {useRecoilState} from "recoil";
import {teamIdState} from "../../state/sportTabState";
import useTeamInfo from "../../hooks/useTeamInfo";
import SockJS from "sockjs-client";
import {over} from "stompjs";
import {DOMAIN_NAME} from "../../App";
import useDeleteMsg from "../../hooks/useDeleteMsg";
import {decodeUserInfo} from "../../utils/UserUtils";
import {getToken, isTokenValid} from "../../utils/token";
import {FaRegTrashAlt} from "react-icons/fa";

const MessageList = ({style}) => {
    const [input, setInput] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const messageEndRef = useRef(null);
    const chatContainerRef = useRef(null);  // 채팅창 컨테이너
    const {messages: chatList, setMessages, fetchMessages} = useTeamMsg();
    const [teamId, setTeamId] = useRecoilState(teamIdState);
    const {teamInfo} = useTeamInfo(teamId);
    const stompClient = useRef(null);
    const subscriptionRef = useRef(null); // 구독 ID를 추적

    const user = decodeUserInfo();

    // console.log 오버라이드 (모든 stomp.js 관련 로그 숨기기)
    useEffect(() => {
        // console.log 오버라이드
        const originalConsoleLog = console.log;
        console.log = (...args) => {
            if (args[0] && typeof args[0] === 'string' && args[0].includes("CONNECTED")) {
                // 특정 조건일 때만 includes 사용

            } else {
            }
        };

        // 추가 로직...
    }, []);


    const handleInputChange = (event) => setInput(event.target.value);

    const handleKeyPress = (event) => {
        if (event.key === "Enter") submitComment();
    };

    const handleInputClick = (event) => {
        if (!isTokenValid()) {
            window.confirm("로그인이 필요한 기능입니다.");
            event.preventDefault();
        }
    };

    const handleCheckboxChange = (event) => {
        setIsAnonymous(event.target.checked);
    };

    const connectWebSocket = () => {
        const token = getToken();
        if (!token) {
            console.error("No token found");
            return;
        }
        const socket = new SockJS(`${DOMAIN_NAME}/ws-chat`);
        stompClient.current = over(socket, {debug: false});
        stompClient.debug = null;

        stompClient.current.connect(
            {
                Authorization: `Bearer ${token}`,
                debug: (msg) => {
                },
            },
            () => {
                subscribeToTeam(teamId); // WebSocket 연결 후 팀 메시지 구독
            },
            (error) => {
                console.error("WebSocket connection error:", error);
            },
        );
    };

    const disconnectWebSocket = () => {
        if (stompClient.current) {
            if (stompClient.current.connected) {
                stompClient.current.disconnect(() => {
                    console.log("WebSocket disconnected");
                });
            }
            unsubscribeFromTeam(); // 구독 해제
        }
    };

    const subscribeToTeam = (teamId) => {
        if (stompClient.current && stompClient.current.connected) {
            // 기존 구독 해제
            unsubscribeFromTeam();

            // 새로운 팀 메시지 구독
            subscriptionRef.current = stompClient.current.subscribe(
                `/topic/cheer-messages-${teamId}`,
                (message) => {
                    const newMessage = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                },
            );
        }
    };

    const unsubscribeFromTeam = () => {
        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
            subscriptionRef.current = null;
        }
    };

    useEffect(() => {
        connectWebSocket();

        return () => {
            disconnectWebSocket();
        };
    }, []);

    useEffect(() => {
        fetchMessages(); // teamId가 0일 때도 호출하도록 수정
    }, [teamId]); // teamId가 변경될 때마다 실행


    const submitComment = () => {
        if (!isTokenValid()) {
            window.confirm("로그인이 필요한 기능입니다.");
            setInput("");
            return;
        }

        if (!input.trim()) return;

        const newComment = {
            userId: user?.userId,
            content: input,
            teamId: teamId,
            isAnonymous: isAnonymous,
        };

        if (stompClient.current && stompClient.current.connected) {
            stompClient.current.send(
                "/app/send/message",
                {},
                JSON.stringify(newComment),
            );
            setInput("");
            setIsAnonymous(false);
        } else {
            console.error("WebSocket is not connected");
        }
    };

    useEffect(() => {
        // 페이지 로드 시 WebSocket 연결
        connectWebSocket();

        return () => {
            // 페이지를 떠날 때 WebSocket 연결 해제
            disconnectWebSocket();
        };
    }, []);

    useEffect(() => {
        // teamId가 변경될 때 구독을 갱신
        if (stompClient.current && stompClient.current.connected) {
            subscribeToTeam(teamId);
        }
    }, [teamId]);

    useEffect(() => {
        // 채팅 메시지가 추가될 때, 채팅창만 스크롤 내리기
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }

        // 윈도우 상단으로 스크롤 이동 (0.1초 뒤)
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    }, [chatList]);

    const {deleteMessage, isLoading, error} = useDeleteMsg();

    const handleDelete = async (messageId) => {
        if (!messageId) return;

        const confirmDelete = window.confirm("이 메시지를 삭제하시겠습니까?");
        if (confirmDelete) {
            try {
                await deleteMessage(messageId);

                setMessages((prevMessages) =>
                    prevMessages.filter((message) => message.id !== messageId),
                );
            } catch (error) {
                console.error("Failed to delete the message:", error);
            }
        }
    };

    return (
        <div className="flex flex-col items-center w-full h-full mt-2">
            <div
                className="flex flex-col justify-between w-full h-full bg-white rounded-2xl border border-gray-400 p-5">
                <div
                    className="flex flex-col w-full overflow-y-auto flex-1 scrollbar-hide"
                    style={{...style}}
                    ref={chatContainerRef}
                >
                    <div
                        className={`flex flex-col flex-grow w-full ${
                            chatList.length === 0
                                ? "justify-center items-center"
                                : "justify-end"
                        }`}
                    >
                        {chatList.length > 0 ? (
                            chatList.map((comment) => {
                                const isCurrentUser = comment.userId === user?.userId;
                                const alignment = isCurrentUser ? "justify-end" : "justify-start";
                                const rowDirection = isCurrentUser ? "flex-row-reverse" : "flex-row";
                                const imageMargin = isCurrentUser ? "ml-2" : "mr-2";

                                // Check if the comment is anonymous and use the anonymous image
                                const displayImage = comment.isAnonymous ? anonymous : comment.userImage;
                                const messageUsername = comment.isAnonymous ? "익명" : comment.username;
                                const messageContent = comment.isHidden ? cleanbotMessage.content : comment.content;
                                const userImage = comment.isHidden ? cleanbotMessage.userImage : displayImage;
                                const username = comment.isHidden ? cleanbotMessage.username : messageUsername;

                                return (
                                    <div key={comment.id} className="w-full">
                                        <div className={`flex ${alignment} mb-4`}>
                                            <div className={`flex ${rowDirection} w-full`}>
                                                <div
                                                    className={`w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 ${
                                                        imageMargin
                                                    }`}
                                                >
                                                    <img src={userImage} alt="user"
                                                         className="w-full h-full object-contain"/>
                                                </div>
                                                <div
                                                    className={`flex flex-col flex-grow items-start bg-gray-100 p-2.5 px-3.5 rounded-2xl ${
                                                        comment.isHidden ? "mr-3" : imageMargin
                                                    } ${!comment.isHidden && !teamInfo?.canUpdatePlayers ? "flex-grow" : "w-4/5"}`}
                                                >
                                                    <div className="flex flex-row justify-between w-full">
                                                        <span className="text-sm font-semibold">{username}</span>
                                                        {!comment.isHidden && (
                                                            <span
                                                                className="text-xs text-gray-500 mt-1">{comment.createdAt}</span>
                                                        )}
                                                    </div>
                                                    <div
                                                        className="text-gray-700 text-sm break-words">{messageContent}</div>
                                                </div>
                                                {!comment.isHidden && teamInfo?.canUpdatePlayers && (
                                                    <div className="p-1.5">
                                                        <FaRegTrashAlt
                                                            className="h-full w-3 text-red-500 cursor-pointer"
                                                            onClick={() => handleDelete(comment.id)}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex justify-center items-center text-gray-400 text-center w-full h-full">
                                메시지가 없습니다. 응원 메시지를 남겨보세요!
                            </div>
                        )}

                        {chatList.length > 0 && <div ref={messageEndRef}></div>}
                    </div>
                </div>
                <div className="flex flex-row w-full items-center justify-center mt-4">
                    <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-gray-200 mr-2">
                        <img src={user?.userImage || userImage} alt={user?.userName}
                             className="w-full h-full object-contain"/>
                    </div>

                    <div
                        className="flex flex-grow items-center  p-1 pl-2.5 rounded-xl bg-gray-100 border border-gray-400">
                        <div className="flex items-center" onClick={handleInputClick}>
                            <input
                                id="checked-checkbox"
                                type="checkbox"
                                checked={isAnonymous}
                                onChange={handleCheckboxChange}
                                disabled={!isTokenValid()}
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
                            placeholder={
                                isTokenValid()
                                    ? teamInfo
                                        ? `${teamInfo.name} 선수들에게 응원 메세지를 남겨보세요!`
                                        : homePlaceHolder
                                    : "로그인이 필요한 기능입니다."
                            }
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyPress}
                            disabled={!isTokenValid()}
                            className="flex-1 text-sm outline-none px-2 py-2 bg-gray-100"
                        />

                        <button onClick={submitComment} disabled={!isTokenValid()}>
                            <img src={sendIcon} alt={sendIcon} className="w-5 h-8 mr-2"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageList;
