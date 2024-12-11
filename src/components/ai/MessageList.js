import {useEffect, useRef, useState} from 'react';
import {chatBotPlaceholder, greeting} from '../../utils/ChatBotUtils';
import sendIcon from '../../assets/icons/send.svg';
import aiLogo from '../../assets/icons/aiLogo.svg';

const MessageList = ({isOpenModal = false}) => {
    const [input, setInput] = useState('');
    const [chatList, setChatList] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTypingNotificationVisible, setIsTypingNotificationVisible] = useState(false);
    const messageEndRef = useRef(null);

    const getCurrentTime = () => {
        const now = new Date();
        return `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    };

    useEffect(() => {
        if (isOpenModal) {
            setTimeout(() => {
                setChatList([
                    {
                        id: 1,
                        userId: 'bot',
                        username: 'AI Chatbot',
                        userImage: aiLogo,
                        content: greeting,
                        createdAt: getCurrentTime(),
                    },
                ]);
            }, 500);
        } else {
            setChatList([]);
        }
    }, [isOpenModal]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({behavior: 'smooth', block: 'end'});
        }
    }, [chatList]);

    const handleInputChange = e => setInput(e.target.value);

    const handleKeyPress = e => {
        if (e.key === 'Enter' && !isSubmitting) {
            submitComment();
        }
    };

    const submitComment = async () => {
        if (!input.trim()) return;

        if (isSubmitting) {
            setIsTypingNotificationVisible(true);
        }

        setIsSubmitting(true);

        const newUserMessage = {
            id: chatList.length + 1,
            userId: 'user',
            username: 'User',
            content: input,
            createdAt: getCurrentTime(),
        };
        setChatList(prev => [...prev, newUserMessage]);
        setInput('');

        try {
            const response = await fetch('https://0be7-203-246-112-24.ngrok-free.app/generate', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({user_input: input}),
            });
            const data = await response.json();

            setIsTypingNotificationVisible(false);

            const newBotMessage = {
                id: chatList.length + 2,
                userId: 'bot',
                username: 'AI Chatbot',
                userImage: aiLogo,
                content: data.response,
                createdAt: getCurrentTime(),
            };
            setChatList(prev => [...prev, newBotMessage]);
        } catch {
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full h-full mt-2 px-2">
            <div className="flex flex-col w-full h-full bg-white overflow-hidden">
                <div
                    className="flex-1 flex flex-col overflow-y-auto scrollbar-hide"
                    style={{minHeight: '0'}}
                >
                    <div className="flex flex-col flex-grow w-full justify-end">
                        {chatList.map(comment => (
                            <div key={comment.id} className="w-full">
                                <div
                                    className={`flex ${comment.userId === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {comment.userId === 'user' ? (
                                        <div className="flex flex-col items-end max-w-xs mb-1">
                                            <div
                                                className="bg-gray-200 text-gray-700 p-2.5 rounded-2xl text-sm break-words">
                                                {comment.content}
                                            </div>
                                            <span
                                                className="text-xs w-full text-gray-500 mt-1">{comment.createdAt}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-start max-w-xs w-full relative mb-4">
                                            <div
                                                className="w-12 h-12 rounded-full overflow-hidden absolute -bottom-4 z-10"
                                                style={{width: '48px', height: '48px'}}
                                            >
                                                <img
                                                    src={aiLogo}
                                                    alt="bot"
                                                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                                />
                                            </div>
                                            <div className="flex-col relative z-0 left-3.5">
                                                <div
                                                    className="bg-gray-700 text-white p-3 rounded-2xl text-sm break-words">
                                                    {comment.content}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1 text-right">
                                                    {comment.createdAt}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isSubmitting && (
                            <div className="flex justify-start items-center mt-2 px-4">
                                <div className="text-sm text-gray-500 animate-pulse">메시지 입력 중...</div>
                            </div>
                        )}
                        {isTypingNotificationVisible && (
                            <div
                                className="flex justify-center items-center text-sm text-gray-500 mt-2 px-4 opacity-100 transition-opacity duration-300 ease-out">
                                메세지 입력중입니다. 조금만 기다려주세요
                            </div>
                        )}
                        {chatList.length > 0 && <div ref={messageEndRef}></div>}
                    </div>
                </div>

                <div className="flex items-center w-full p-1 pl-2.5 rounded-xl bg-gray-100 mt-2 border border-gray-400">
                    <input
                        type="text"
                        placeholder={chatBotPlaceholder}
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        className="flex-1 text-sm outline-none px-2 py-2 bg-gray-100"
                    />
                    <button onClick={submitComment} disabled={isSubmitting}>
                        <img src={sendIcon} className="w-5 h-5 mr-2"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageList;
