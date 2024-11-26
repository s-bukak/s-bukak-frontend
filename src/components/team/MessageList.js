import { useEffect, useRef, useState } from "react";
import {
  user,
  cleanbotMessage,
  homePlaceHolder,
} from "../../utils/MessageUtils";
import { IoIosSend } from "react-icons/io";
import useTeamMsg from "../../hooks/useTeamMsg";

const MessageList = ({ teamInfo, style }) => {
  const [input, setInput] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false); // 익명 여부 상태 추가
  const messageEndRef = useRef(null);
  const { messages: chatList, setMessages: setChatList } = useTeamMsg();

  const handleInputChange = (event) => setInput(event.target.value);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") submitComment();
  };

  const handleCheckboxChange = (event) => {
    setIsAnonymous(event.target.checked);
  };

  const submitComment = () => {
    if (!input.trim()) return;

    const newComment = {
      id: chatList.length + 1,
      userId: user.userId,
      username: user.userName,
      userImage: user.userImage,
      content: input,
      createdAt: (() => {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, "0"); // 월: 0부터 시작하므로 +1
        const day = String(now.getDate()).padStart(2, "0"); // 일
        const hours = String(now.getHours()).padStart(2, "0"); // 시
        const minutes = String(now.getMinutes()).padStart(2, "0"); // 분
        return `${month}/${day} ${hours}:${minutes}`;
      })(),
      isAnonymous: isAnonymous, // 체크박스 상태 반영
      isHidden: false,
    };
    setChatList((prevChatList) => [...prevChatList, newComment]);
    setInput("");
  };
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ block: "nearest" });
  }, [chatList]);
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ block: "nearest" });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col items-center w-full h-full mt-2">
      <div className="flex flex-col justify-between w-full h-full bg-white rounded-2xl border border-gray-400 p-4">
        <div
          className="flex flex-col overflow-y-auto pb-0 mb-0 flex-1 justify-center"
          style={{ ...style }}
        >
          {chatList.length > 0 ? (
            chatList.map((comment, index) => (
              <div key={comment.id} className="w-full">
                <div
                  className={`flex ${comment.userId === user.userId ? "justify-end" : "justify-start"} mb-1`}
                >
                  {comment.userId === user.userId ? (
                    <>
                      <div className="flex flex-col items-end max-w-xs">
                        <div className="flex items-center mb-1">
                          <span className="text-sm font-semibold">
                            {user.userName}
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
                              ? "../../images/Anonymous.jpg"
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
                        <div className="bg-gray-100 text-gray-700 p-2.5 rounded-lg text-sm break-words">
                          {comment.content}
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
            <div className="flex h-full text-gray-400 text-center justify-center items-center">
              메시지가 없습니다. 응원 메시지를 남겨보세요!
            </div>
          )}
          <div ref={messageEndRef}></div> {/* 하단 참조 */}
        </div>

        <div className="flex items-center w-full p-1 pl-2.5 rounded-xl bg-gray-100 mt-4 border border-gray-400">
          <div className="flex items-center">
            <input
              id="checked-checkbox"
              type="checkbox"
              checked={isAnonymous}
              onChange={handleCheckboxChange}
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
                ? `${teamInfo.name} 선수들에게 응원 메세지를 남겨보세요!`
                : homePlaceHolder
            }
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className="flex-1 text-sm outline-none px-2 py-2 bg-gray-100"
          />

          <button onClick={submitComment}>
            <IoIosSend color="gray-500" className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageList;
