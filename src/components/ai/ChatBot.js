import React, { useEffect, useRef, useState } from 'react';
import aiLogo from '../../assets/icons/aiLogo.svg';
import { CiCircleMinus } from 'react-icons/ci';
import MessageList from './MessageList';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef();

  const toggleChatBot = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = event => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div>
      {isOpen && (
        <div
          className="fixed bottom-28 right-10 w-full max-w-sm h-full max-h-[70%] bg-white rounded-lg z-50 flex flex-col"
          style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)' }}
        >
          <div
            className="px-3 py-2 bg-gray-800 text-white flex justify-between items-center rounded-t-md "
            style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.45)', zIndex: 60 }}
          >
            <div className="flex flex-row">
              <img src={aiLogo} className="w-14 h-14" alt="AI Logo" />
              <div className="flex flex-col ml-0.5 pt-2">
                <span className="font-bold">부각이</span>
                <span className="font-extralight text-xs">평균 답장 시간 1분 이내</span>
              </div>
            </div>
            <button onClick={toggleChatBot} className="mr-2" aria-label="Close chat">
              <CiCircleMinus className="text-white" size={22} />
            </button>
          </div>
          {/* 내부 스크롤 */}
          <div className="flex-1 h-full max-h-[83%] w-full z-50">
            <MessageList isOpenModal={isOpen} />
          </div>
        </div>
      )}
      <button
        onClick={toggleChatBot}
        className="fixed bottom-10 right-10 w-14 h-14 bg-white rounded-full drop-shadow-lg shadow-gray-700 flex justify-center items-center z-50 focus:outline-none focus:ring-2"
        aria-label="Open chat"
      >
        <img src={aiLogo} className="w-full h-full" alt="Open Chat" />
      </button>
    </div>
  );
};

export default ChatBot;
