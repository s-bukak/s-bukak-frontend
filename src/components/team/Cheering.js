import React from "react";
import MessageList from "./MessageList";
import {
  homeMessageSubtitle,
  teamMessageSubtitle,
} from "../../utils/MessageUtils";

const Cheering = ({ teamInfo }) => {
  return (
    <div className="mt-6 ">
      <h2 className="text-3xl font-bold mb-1.5">응원 메시지 남기기</h2>
      <h3
        className="text-sm text-gray-500 mb-2"
        style={{ whiteSpace: "pre-line" }}
      >
        {teamInfo ? teamMessageSubtitle : homeMessageSubtitle}
      </h3>
      <MessageList
        className="w-full md:w-1/2"
        teamInfo={teamInfo}
        style={{
          minHeight: "70vh", // 최소 높이 설정
          maxHeight: "70vh", // 최대 높이 설정 (스크롤 활성화)
          overflowY: "auto", // 세로 스크롤 활성화
        }}
      />
    </div>
  );
};

export default Cheering;
