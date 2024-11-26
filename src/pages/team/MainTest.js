import Cheering from "../../components/team/Cheering";
import React from "react";
import MessageList from "../../components/team/MessageList";

const MainTest = () => {
  return (
    <div className="container mx-auto p-4 my-20">
      <div className="flex items-center space-x-4 mx-52 mb-14 justify-between">
        {/* 왼쪽 (최근 경기 전적, 포메이션, 경기 일정) */}
        <div className="">
          {/* 응원 메시지 남기는 댓글창 컴포넌트 */}
          <MessageList
            className="w-2/3"
            style={{
              minHeight: "40vh", // 최소 높이 설정
              maxHeight: "50vh", // 최대 높이 설정 (스크롤 활성화)
              overflowY: "auto", // 세로 스크롤 활성화
              width: "80vh",
              marginTop: "auto",
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default MainTest;
