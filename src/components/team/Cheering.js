import React from "react";
import MessageList from "./MessageList";
import {
  homeMessageSubtitle,
  teamMessageSubtitle,
} from "../../utils/MessageUtils";

const Cheering = ({ teamName }) => {
  return (
    <div className="mt-6 ">
      <h2 className="text-3xl font-bold mb-1.5">응원 메시지 남기기</h2>
      <h3
        className="text-sm text-gray-500 mb-2"
        style={{ whiteSpace: "pre-line" }}
      >
        {teamName ? teamMessageSubtitle : homeMessageSubtitle}
      </h3>
      <MessageList className="w-full md:w-1/2 p-4" />
    </div>
  );
};

export default Cheering;
