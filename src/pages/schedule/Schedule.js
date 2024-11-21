import React, { useState, useEffect } from "react";
import { DOMAIN_NAME, TOKEN_NAME } from "../../App";
import axios from "axios";

export default function Schedule() {
  const months = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월",
  ];
  const [clickedMonth, setClickedMonth] = useState(null);
  const [filteredData, setFilteredData] = useState([]); // API에서 받아온 데이터 상태
  const [calendarYear, setCalendarYear] = useState(null); // 백엔드에서 받아온 year

  // 일정 데이터를 가져오는 함수
  const fetchSchedule = async () => {
    try {
      const response = await axios.get(`${DOMAIN_NAME}/schedule`, {
        headers: {
          Authorization: `Bearer ${TOKEN_NAME}`,
        },
      });

      // Null-safe 처리: schedulesYear가 없을 경우 빈 배열로 설정
      const schedulesYear = response.data.schedulesYear || [];
      // 필요한 데이터 파싱
      const formattedData = schedulesYear.flatMap((yearData) =>
        yearData.schedulesMonth.flatMap((monthData) =>
          monthData.schedules.map((schedule) => ({
            year: yearData.year,
            month: monthData.month,
            scheduleId: schedule.scheduleId,
            startDate: schedule.startDate,
            startTime: schedule.startTime,
            leagueName: schedule.leagueName,
            sportType: schedule.sportType,
            betTimeType: schedule.betTimeType,
            homeTeamName: schedule.homeTeamName,
            homeTeamIconImageUrl: schedule.homeTeamIconImageUrl,
            awayTeamName: schedule.awayTeamName,
            awayTeamIconImageUrl: schedule.awayTeamIconImageUrl,
            place: schedule.place,
          }))
        )
      );

      // 상태에 저장
      setFilteredData(formattedData);

      // 첫 번째 year 값을 설정
      if (schedulesYear.length > 0) {
        setCalendarYear(schedulesYear[0].year);
      }

      console.log("Formatted Data:", formattedData); // 디버깅용
    } catch (error) {
      console.error("Error fetching schedule:", error);
      setFilteredData([]); // 오류 시 빈 배열 설정
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  // 선택한 월의 경기를 필터링하고 날짜별로 그룹화
  const filteredSchedule = filteredData
    .filter((item) => item.month === clickedMonth + 1)
    .reduce((acc, item) => {
      if (!acc[item.startDate]) {
        acc[item.startDate] = [];
      }
      acc[item.startDate].push(item);
      return acc;
    }, {});

  return (
    <div className="w-full px-8 flex flex-col">
      {/* 년도 표시 */}
      <div className="w-full font-bold text-gray-800 text-2xl flex justify-center my-8">
        {calendarYear || "연도 불러오는 중..."}
      </div>

      {/* 월 표시 */}
      <div className="w-full border border-x-0 border-t-gray-400 flex flex-wrap justify-center gap-3 ">
        {months.map((month, index) => (
          <button
            key={index}
            className={`px-9 py-2 ${
              clickedMonth === index ? "text-gray-800" : "text-gray-400"
            }`}
            onClick={() => setClickedMonth(index)}
          >
            {month}
          </button>
        ))}
      </div>

      {/* 일정 표시 */}
      <div className="w-full h-96 overflow-y-scroll flex justify-center">
        <div className="w-full">
          {Object.keys(filteredSchedule).length > 0 ? (
            Object.entries(filteredSchedule).map(([date, matches], idx) => (
              <div key={idx}>
                <div className="font-bold bg-gray-100 p-2 border border-t-gray-400 border-x-0">
                  {date}
                </div>
                {matches.map((match, i) => (
                  <div
                    key={i}
                    className="flex flex-row justify-between items-center w-full p-2 border border-t-gray-400 border-x-0"
                  >
                    {/* 왼쪽 정렬 그룹 */}
                    <div className="flex flex-row items-center flex-grow-0">
                      <div className="mr-2 text-sm">{match.startTime}</div>
                      <div className="text-gray-400 text-xs">
                        {match.leagueName}
                      </div>
                      <div className="text-gray-400 text-xs">
                        [{match.sportType}]
                      </div>
                      <div
                        className={`ml-2 text-xs rounded-lg px-1.5 py-0.5 ${
                          match.betTimeType === "예측종료"
                            ? "bg-red-200 text-red-700 border border-red-700"
                            : match.betTimeType === "예측진행중"
                              ? "bg-lime-200 text-lime-700 border-lime-700"
                              : "bg-sky-100 text-sky-600 border-sky-600"
                        }`}
                      >
                        {match.betTimeType || "예측종료"}
                      </div>
                    </div>

                    {/* 가운데 정렬 (이미지 및 팀 이름) */}
                    <div className="flex justify-center items-center space-x-2 font-semibold mx-auto">
                      <img
                        src={match.homeTeamIconImageUrl}
                        alt={match.homeTeamName}
                        className="h-6 w-6"
                      />
                      <span>{match.homeTeamName}</span>
                      <span className="mx-2">vs</span>
                      <span>{match.awayTeamName}</span>
                      <img
                        src={match.awayTeamIconImageUrl}
                        alt={match.awayTeamName}
                        className="h-6 w-6"
                      />
                    </div>

                    {/* 오른쪽 정렬 */}
                    <div className="pl-20 flex items-center text-gray-800 text-xs ">
                      장소: {match.place}
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="flex justify-center">해당 월에 경기가 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}
