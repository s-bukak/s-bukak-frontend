import React, { useState } from 'react';
import Aigu from '../../assets/logos/soccer/aigu.svg';
import Shooting from '../../assets/logos/soccer/cs-shooting.svg';

export default function Schedule() {
  const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
  const [clickedMonth, setClickedMonth] = useState(null);

  // 경기 일정 데이터
  const scheduleData = [
    {
      year: 2024,
      month: 5,
      startDate: "5월 23일",
      startTime: "15:00",
      leagueName: "성곡리그",
      sportType: "축구",
      homeTeamName: "슈팅",
      homeTeamIconImageUrl: Aigu,
      awayTeamName: "쉐도우",
      awayTeamIconImageUrl: Aigu,
      place: "운동장"
    },
    {
      year: 2024,
      month: 5,
      startDate: "5월 23일",
      startTime: "18:00",
      leagueName: "해동리그",
      sportType: "농구",
      homeTeamName: "슈팅",
      homeTeamIconImageUrl: Aigu,
      awayTeamName: "한마음",
      awayTeamIconImageUrl: Aigu,
      place: "농구장"
    },
    {
      year: 2024,
      month: 5,
      startDate: "5월 28일",
      startTime: "18:00",
      leagueName: "해동리그",
      sportType: "농구",
      homeTeamName: "슈팅",
      homeTeamIconImageUrl: Aigu,
      awayTeamName: "한마음",
      awayTeamIconImageUrl: Aigu,
      place: "농구장"
    },
    {
      year: 2024,
      month: 5,
      startDate: "5월 01일",
      startTime: "18:00",
      leagueName: "해동리그",
      sportType: "농구",
      homeTeamName: "슈팅",
      homeTeamIconImageUrl: Aigu,
      awayTeamName: "한마음",
      awayTeamIconImageUrl: Aigu,
      place: "농구장"
    },
    {
      year: 2024,
      month: 5,
      startDate: "5월 29일",
      startTime: "18:00",
      leagueName: "해동리그",
      sportType: "농구",
      homeTeamName: "슈팅",
      homeTeamIconImageUrl: Aigu,
      awayTeamName: "한마음",
      awayTeamIconImageUrl: Aigu,
      place: "농구장"
    },
    {
      year: 2024,
      month: 5,
      startDate: "5월 13일",
      startTime: "18:00",
      leagueName: "해동리그",
      sportType: "농구",
      homeTeamName: "슈팅",
      homeTeamIconImageUrl: Aigu,
      awayTeamName: "한마음",
      awayTeamIconImageUrl: Aigu,
      place: "농구장"
    },
    {
      year: 2024,
      month: 6,
      startDate: "6월 2일",
      startTime: "14:00",
      leagueName: "성곡리그",
      sportType: "축구",
      homeTeamName: "Aigu",
      homeTeamIconImageUrl: "/path/to/aigu-icon.svg",
      awayTeamName: "Shooting",
      awayTeamIconImageUrl: "/path/to/shooting-icon.svg",
      place: "운동장"
    },
    // 추가 경기 일정 데이터
  ];

  // 선택한 월의 경기를 필터링하고 날짜별로 그룹화
  const filteredSchedule = scheduleData
    .filter(item => item.month === clickedMonth + 1)
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
        2024
      </div>

      {/* 월 표시 */}
      <div className="w-full border border-x-0 border-t-gray-400 flex flex-wrap justify-center gap-3 ">
        {months.map((month, index) => (
          <button
            key={index}
            className={`px-9 py-2 ${clickedMonth === index ? "text-gray-800" : "text-gray-400"}`}
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
              <div key={idx} className="">
                <div className="font-bold bg-gray-100 p-2 border border-t-gray-400 border-x-0 bg">{date}</div>
                {matches.map((match, i) => (
                  <div key={i}
                       className="flex flex-row justify-between items-center bg-red-400 w-full p-2 border border-t-gray-400 border-x-0">
                    {/* 왼쪽 정렬 그룹 */}
                    <div className="flex flex-row items-center flex-grow-0">
                      <div className="mr-2 text-sm">{match.startTime}</div>
                      <div className="text-gray-400 text-xs">{match.leagueName}</div>
                      <div className="text-gray-400 text-xs">[{match.sportType}]</div>
                      <div className="ml-2 text-sm">{match.status || "예정"}</div>
                    </div>

                    {/* 가운데 정렬 (이미지 및 팀 이름) */}
                    <div className="flex justify-center items-center space-x-2 font-semibold mx-auto">
                      <img src={match.homeTeamIconImageUrl} alt={match.homeTeamName} className="h-6 w-6"/>
                      <span>{match.homeTeamName}</span>
                      <span className="mx-2">vs</span>
                      <span>{match.awayTeamName}</span>
                      <img src={match.awayTeamIconImageUrl} alt={match.awayTeamName} className="h-6 w-6"/>
                    </div>

                    {/* 오른쪽 정렬 (주석 처리된 상태) */}
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
