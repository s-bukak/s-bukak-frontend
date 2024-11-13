import React from 'react';
import CommunityButton from "../../../components/CommunityButton";
import Profile from "../../../assets/icons/profile.svg";
import Send from "../../../assets/icons/send.svg";

export default function CommunityDetail() {
  // 예시 댓글 데이터
  const comments = [
    { id: 1, name: "송규원(학부생 - 소프트웨어학부)", content: "저도 연습경기 하고 싶어요!", time: "24/04/02 14:30" },
    { id: 2, name: "박수연(학부생 - 소프트웨어학부)", content: "팀 구하시는 거 보니 관심 가네요!", time: "24/04/02 15:00" },
    { id: 3, name: "안선영(학부생 - 인공지능학부)", content: "카톡으로 연락 드렸습니다!", time: "24/04/02 15:30" },
    { id: 3, name: "안선영(학부생 - 인공지능학부)", content: "카톡으로 연락 드렸습니다!", time: "24/04/02 15:30" },
    { id: 3, name: "안선영(학부생 - 인공지능학부)", content: "카톡으로 연락 드렸습니다!", time: "24/04/02 15:30" },
    { id: 3, name: "안선영(학부생 - 인공지능학부)", content: "카톡으로 연락 드렸습니다!", time: "24/04/02 15:30" },
  ];

  return (
    <div className="flex flex-row w-full gap-[75px]">
      <div className="pl-36 p-4">
        <CommunityButton />
      </div>

      <div className="w-3/5 p-4">
        <div className="w-full border border-gray-300 rounded-lg overflow-hidden relative p-10 px-16 flex flex-col gap-6">
          <div className="h-100dvh flex justify-center flex-col gap-8 ">
            <div className="flex justify-between">
              <div className="flex flex-row items-center gap-2.5">
                <img src={Profile} alt="Profile"/>
                <div className="font-semibold text-base">정찬우(학부생-소프트웨어학부 소프트웨어전공)</div>
              </div>
              <div className="text-gray-600 text-sm">24/03/23 13:40</div>
            </div>

            <div className="font-bold text-2xl">
            4월 주말에 연습경기하실 팀 구해요
            </div>
            <div className="font-regular text-base">
              안녕하세요 저희는 소융대 축구동아리 CS슈팅입니다
              4월 주말에 연습경기 가능하신 팀들 구하고 있습니다! 시간은 최대한 맞춰드릴 수 있으니까 의향 있으신 분들은 카톡으로 연락 주세요!! 카톡 아이디 : xxchanwoooo
            </div>
          </div>

          <div className="flex items-center flex-col gap-8 rounded-2xl h-96 p-6 border border-gray-300">
            <div className="w-full h-[80%] p-4 overflow-y-scroll">
              {comments.map((comment) => (
                <div key={comment.id} className="mb-4 p-2 bg-gray-200 rounded-lg ">
                  <div className="flex flex-row items-center justify-between">
                    <div className="font-semibold text-sm flex-1">{comment.name}</div>
                    <div className="text-gray-600 text-sm">{comment.time}</div>
                  </div>
                  <div className="text-base mt-1">{comment.content}</div>
                </div>
              ))}
            </div>

            <div className="w-full flex justify-between items-center p-2 rounded-lg border border-gray-300">
              <label className="flex items-center gap-2 mr-4">
                <input type="checkbox" className="cursor-pointer"/>
                <span className="text-sm">익명</span>
              </label>
              <input
                className="w-[80%] p-2 rounded-lg focus:outline-none"
                placeholder="댓글을 입력하세요"
              />
              <img src={Send} alt="Send" className="w-6 h-6 cursor-pointer ml-2"/>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
