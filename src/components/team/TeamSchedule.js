import React, { useState } from "react";

const TeamSchedule = ({ owner, schedules = [] }) => {
  const [selectedYear, setSelectedYear] = useState("2024"); // 기본값은 2024

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
              onClick={() => setSelectedYear(year)}
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
        {filteredSchedules && filteredSchedules.length > 0 ? (
          filteredSchedules.map((match, index) => (
            <div
              key={index}
              className={`flex items-center justify-between px-6 py-3 rounded-lg ${
                index % 2 === 0 ? "bg-white" : "bg-transparent"
              }`}
            >
              <div className="w-28 flex items-center text-left space-x-2">
                <img
                  src={owner.logoUrl}
                  alt={owner.name}
                  className="w-7 h-7 object-cover rounded-full"
                />
                <div className="text-left">
                  <span className="text-sm">{owner.name}</span>
                </div>
              </div>
              <div className="text-center w-28">
                <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full">
                  {match.result || "-"}
                </span>
              </div>
              <div className="w-28 flex items-center text-right space-x-2 justify-end">
                <div
                  className="text-end
              "
                >
                  <span className="text-sm">{match.opponent}</span>
                </div>
                <img
                  src={match.opponentName}
                  alt={match.opponent}
                  className="w-7 h-7 object-cover rounded-full text-right right-0"
                />
              </div>
              <div className="px-4 text-right">
                <span className="text-sm text-gray-700 font-light">
                  {match.date}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-32 bg-gray-100 rounded-lg w-full">
            <p className="text-gray-500 text-sm">데이터가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamSchedule;
