import { useEffect, useRef, useState } from 'react';
import { chatBotPlaceholder, initialChatList, user } from '../../utils/ChatBotUtils';
import { IoIosSend } from 'react-icons/io';
import aiLogo from '../../assets/icons/aiLogo.svg';

const MessageList = ({ teamInfo }) => {
  const [input, setInput] = useState('');
  const messageEndRef = useRef(null);
  const [chatList, setChatList] = useState(initialChatList);

  const handleInputChange = event => setInput(event.target.value);

  const handleKeyPress = event => {
    if (event.key === 'Enter') submitComment();
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
        const month = String(now.getMonth() + 1).padStart(2, '0'); // 월: 0부터 시작하므로 +1
        const day = String(now.getDate()).padStart(2, '0'); // 일
        const hours = String(now.getHours()).padStart(2, '0'); // 시
        const minutes = String(now.getMinutes()).padStart(2, '0'); // 분
        return `${month}/${day} ${hours}:${minutes}`;
      })(),
    };
    setChatList(prevChatList => [...prevChatList, newComment]);
    setInput('');
  };
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ block: 'nearest' });
  }, [chatList]);
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ block: 'nearest' });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col items-center w-full h-full mt-2 px-2">
      {/* 전체 컨테이너 */}
      <div className="flex flex-col justify-between w-full h-full bg-white rounded-2xl">
        {/* 메시지 리스트 */}
        <div
          className="flex-1 overflow-y-auto min-h-0 scrollbar-hide"
          style={{ height: 'calc(100% - 4rem)' }} // 높이 계산으로 스크롤 활성화
        >
          {chatList.map((comment, index) => {
            const isLastMessageInTimeGroup =
              index === chatList.length - 1 || // 마지막 메시지이거나
              comment.userId !== chatList[index + 1]?.userId || // 다음 메시지의 userId가 다르거나
              comment.createdAt !== chatList[index + 1]?.createdAt; // 다음 메시지의 createdAt이 다를 때

            return (
              <div key={comment.id} className="w-full">
                <div
                  className={`flex ${
                    comment.userId === user.userId ? 'justify-end' : 'justify-start'
                  } mb-1`}
                >
                  {comment.userId === user.userId ? (
                    <div className="flex flex-col items-end max-w-xs">
                      <div
                        className="bg-blue-100 text-gray-700 p-2.5 rounded-lg text-sm break-words"
                        style={{
                          wordBreak: 'break-word',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {comment.content}
                      </div>
                      {isLastMessageInTimeGroup && (
                        <span className="text-xs text-gray-500 mt-1">{comment.createdAt}</span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-start max-w-xs">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 mr-3">
                        <img src={aiLogo} alt="user" />
                      </div>
                      <div className="flex flex-col">
                        <div className="bg-gray-100 text-gray-700 p-2.5 rounded-lg text-sm break-words">
                          {comment.content}
                        </div>
                        {isLastMessageInTimeGroup && (
                          <span className="text-xs text-gray-500 mt-1">{comment.createdAt}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messageEndRef}></div>
        </div>

        {/* 입력 창 */}
        <div className="flex items-center w-full p-1 pl-2.5 rounded-xl bg-gray-100 mt-4 border border-gray-400">
          <input
            type="text"
            placeholder={chatBotPlaceholder}
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
