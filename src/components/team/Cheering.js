import React, { useState } from "react";
import MessageList from "./MessageList";

const Cheering = ({ teamName }) => {
  const [comments, setComments] = useState("");

  const handleCommentChange = (e) => {
    setComments(e.target.value);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // 댓글 제출 처리 로직 (ex. 서버에 저장하기)
    console.log(`Comment for ${teamName}:`, comments);
    setComments("");
  };

  return (
    <div className="mt-6 ">
      <h2 className="text-3xl font-bold mb-1">응원 메시지</h2>
      <h3 className="text-sm text-gray-500">
        매 경기에 최선을 다하는 선수들을 위해 응원메세지를 남겨보세요!
      </h3>
      <MessageList className="w-full md:w-1/2 p-4" />
    </div>
  );
};

export default Cheering;
