import React, { useState } from "react";
import { getTeamLogoPath } from "../../utils/LogoUtils";
import { activeSportTabState } from "../../state/sportTabState";
import { useRecoilValue } from "recoil";

const TeamSchedule = ({ owner, schedules = [] }) => {
  const activeSportTab = useRecoilValue(activeSportTabState);

  // 연도 필터를 위한 상태 관리
  const [selectedYear, setSelectedYear] = useState("2024"); // 기본값은 2024

  // 연도 필터링 함수
  const filteredSchedules = schedules.filter((match) =>
    match.date.startsWith(selectedYear),
  );

  return (
    <div className="w-full p-0">
      <h2 className="text-xl font-bold mb-4">경기 일정</h2>
      <div className="border-b-2 border-gray-200 mb-4">
        <ul className="flex space-x-4">
          {/* 연도 탭 */}
          {["2024", "2023", "2022", "2021", "2020"].map((year) => (
            <li
              key={year}
              onClick={() => setSelectedYear(year)} // 연도를 클릭하면 상태 업데이트
              className={`cursor-pointer px-4 ${
                selectedYear === year
                  ? "font-bold border-b-4 border-gray-700 text-gray-700"
                  : "text-gray-400"
              }`}
            >
              {year}
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y">
        {filteredSchedules.map((match, index) => (
          <div
            key={index}
            className={`flex items-center justify-between px-6 py-3 rounded-lg ${
              index % 2 === 0 ? "bg-white" : "bg-transparent" // 짝수 타일은 흰색 배경, 홀수 타일은 배경색 제거
            }`}
          >
            <div className="w-20 flex items-center text-left space-x-2">
              {/* 팀 로고 */}
              <img
                src={owner.logoUrl}
                alt={owner.name}
                className="w-7 h-7 object-cover rounded-full"
              />
              <div className="text-left">
                <span className="text-sm">{owner.name}</span>
              </div>
            </div>
            {/* 경기 결과 */}
            <div className="text-center w-28">
              <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full">
                {match.result || "-"}
              </span>
            </div>
            {/* 상대 팀 정보 */}
            <div className="w-28 flex items-center text-right space-x-2 justify-end">
              <div
                className="text-end
              "
              >
                <span className="text-sm">{match.opponentName}</span>
              </div>
              {/* 상대 팀 로고 */}
              <img
                src={getTeamLogoPath(activeSportTab, match.opponent)}
                alt={match.opponentName}
                className="w-7 h-7 object-cover rounded-full text-right right-0"
              />
            </div>
            {/* 경기 날짜 */}
            <div className="text-right">
              <span className="text-sm text-gray-700 font-light">
                {match.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamSchedule;