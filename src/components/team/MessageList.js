import { useEffect, useRef, useState } from "react";
import { cleanbotMessage, homePlaceHolder } from "../../utils/MessageUtils";
import anonymous from "../../assets/images/anonymous.svg";
import { IoIosSend } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
import useTeamMsg from "../../hooks/useTeamMsg";
import { useRecoilState } from "recoil";
import { teamIdState } from "../../state/sportTabState";
import useTeamInfo from "../../hooks/useTeamInfo";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import { DOMAIN_NAME } from "../../App";
import useDeleteMsg from "../../hooks/useDeleteMsg";
import { decodeUserInfo } from "../../utils/userUtils";
import { getToken, isTokenValid } from "../../utils/token";

const MessageList = ({ style }) => {
  const [input, setInput] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const messageEndRef = useRef(null);
  const { messages: chatList, setMessages, fetchMessages } = useTeamMsg();
  const [teamId, setTeamId] = useRecoilState(teamIdState);
  const { teamInfo } = useTeamInfo(teamId);
  const stompClient = useRef(null);
  const subscriptionRef = useRef(null); // 구독 ID를 추적

  const user = decodeUserInfo();

  // console.log 오버라이드 (모든 stomp.js 관련 로그 숨기기)
  useEffect(() => {
    console.log = (...args) => {
      if (
        args[0] &&
        (args[0].includes("CONNECTED") ||
          args[0].includes("SUBSCRIBE") ||
          args[0].includes("DISCONNECT") ||
          args[0].includes("UNSUBSCRIBE"))
      ) {
        // WebSocket 관련 로그는 무시
      }
    };
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
    stompClient.current = over(socket, { debug: false });
    stompClient.debug = null;

    stompClient.current.connect(
      {
        Authorization: `Bearer ${token}`,
        debug: (msg) => {},
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
    messageEndRef.current?.scrollIntoView({ block: "nearest" });
  }, [chatList]);
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ block: "nearest" });
    window.scrollTo(0, 0);
  }, []);

  const { deleteMessage, isLoading, error } = useDeleteMsg();

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
      <div className="flex flex-col justify-between w-full h-full bg-white rounded-2xl border border-gray-400 p-4">
        <div
          className="flex flex-col overflow-y-auto flex-1"
          style={{ ...style }}
        >
          <div
            className={`flex flex-col flex-grow ${
              chatList.length === 0
                ? "justify-center items-center"
                : "justify-end"
            }`}
          >
            {chatList.length > 0 ? (
              chatList.map((comment) => (
                <div key={comment.id} className="w-full">
                  <div
                    className={`flex ${
                      comment.userId === user?.userId
                        ? "justify-end"
                        : "justify-start"
                    } mb-1`}
                  >
                    {comment.userId === user?.userId ? (
                      <>
                        <div className="flex flex-col items-end max-w-xs">
                          <div className="flex items-center mb-1">
                            <span className="text-sm font-semibold">
                              {user?.userName}
                            </span>
                          </div>
                          <div className="bg-blue-100 text-gray-700 p-2.5 rounded-lg text-sm break-words">
                            {comment.content}
                          </div>
                          <span className="text-xs text-gray-500 mt-1">
                            {comment.createdAt}
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 ml-3">
                          <img src={comment.userImage} alt="user" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 mr-3">
                          <img
                            src={
                              comment.isAnonymous
                                ? anonymous
                                : comment.userImage
                            }
                            alt="user"
                          />
                        </div>
                        <div className="flex flex-col items-start max-w-xs">
                          <div className="flex items-center mb-1">
                            <span className="text-sm font-semibold">
                              {comment.isAnonymous ? "익명" : comment.username}
                            </span>
                          </div>
                          <div className="flex flex-row">
                            <div className="bg-gray-100 text-gray-700 p-2.5 rounded-lg text-sm break-words">
                              {comment.content}
                            </div>
                            {teamInfo?.canUpdatePlayers &&
                              !comment.isHidden && (
                                <div className="p-1.5">
                                  <FaRegTrashAlt
                                    className=" flex justify-center  h-full w-3 text-red-500"
                                    onClick={() => handleDelete(comment.id)}
                                  />
                                </div>
                              )}
                          </div>

                          <span className="text-xs text-gray-500 mt-1">
                            {comment.createdAt}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  {comment.isHidden && (
                    <div className="flex justify-start mb-3 w-full">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 mr-3">
                        <img src={cleanbotMessage.userImage} alt="cleanbot" />
                      </div>
                      <div className="flex flex-col items-start max-w-xs">
                        <div className="flex items-center mb-1">
                          <span className="text-sm font-semibold">
                            {cleanbotMessage.username}
                          </span>
                        </div>
                        <div className="flex flex-row">
                          <div className="bg-gray-100 text-gray-700 p-2.5 rounded-lg text-sm break-words">
                            {cleanbotMessage.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center text-gray-400 text-center h-full">
                메시지가 없습니다. 응원 메시지를 남겨보세요!
              </div>
            )}
            {chatList.length > 0 && <div ref={messageEndRef}></div>}
          </div>
        </div>

        <div className="flex items-center w-full p-1 pl-2.5 rounded-xl bg-gray-100 mt-4 border border-gray-400">
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
              teamInfo
                ? isTokenValid()
                  ? `${teamInfo.name} 선수들에게 응원 메세지를 남겨보세요!`
                  : "로그인이 필요한 기능입니다."
                : homePlaceHolder
            }
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            disabled={!isTokenValid()}
            className="flex-1 text-sm outline-none px-2 py-2 bg-gray-100"
          />

          <button onClick={submitComment} disabled={!isTokenValid()}>
            <IoIosSend color="gray-500" className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageList;
