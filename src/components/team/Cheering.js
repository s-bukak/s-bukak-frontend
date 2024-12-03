import React from "react";
import MessageList from "./MessageList";
import {teamMessageSubtitle} from "../../utils/MessageUtils";

const Cheering = () => {
    return (
        <div className="w-full mt-1">
            <h2 className="text-3xl font-bold mb-1.5">응원 메시지 남기기</h2>
            <h3
                className="text-sm text-gray-500 mb-2 pr-1"
                style={{whiteSpace: "pre-line"}}
            >
                {teamMessageSubtitle}
            </h3>
            <MessageList
                className="w-full md:w-1/3"
                style={{
                    minHeight: "88vh", // 최소 높이 설정
                    maxHeight: "88vh", // 최대 높이 설정 (스크롤 활성화)
                    overflowY: "auto", // 세로 스크롤 활성화
                }}
            />
        </div>
    );
};

export default Cheering;
