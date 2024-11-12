import Cheering from "../../components/team/Cheering";
import React from "react";

const MainTest = () => {
  return (
    <div className="container mx-auto p-4 my-20">
      <div className="flex items-center space-x-4 mx-52 mb-14 justify-between">
        {/* 왼쪽 (최근 경기 전적, 포메이션, 경기 일정) */}
        <div className="lg:w-2/3">
          {/* 응원 메시지 남기는 댓글창 컴포넌트 */}
          <Cheering />
        </div>
      </div>
    </div>
  );
};
export default MainTest;
