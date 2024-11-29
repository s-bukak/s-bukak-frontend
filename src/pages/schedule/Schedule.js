import React, {useState, useEffect} from "react";
import {DOMAIN_NAME, TOKEN_NAME} from "../../App";
import axios from "axios";
import StatusIndicator from "../../components/StateIndecator"; // StatusIndicator 컴포넌트 임포트
import {MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight} from "react-icons/md";


export default function Schedule() {
  const months = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월",
  ];
  const [clickedMonth, setClickedMonth] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear()); // 현재 연도로 초기화

  const fetchSchedule = async () => {
    try {
      const response = await axios.get(`${DOMAIN_NAME}/schedule`, {
        headers: {
          Authorization: `Bearer ${TOKEN_NAME}`,
        },
      });

      const schedulesYear = response.data.schedulesYear || [];
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

      setFilteredData(formattedData);

      if (schedulesYear.length > 0) {
        setCalendarYear(schedulesYear[0].year); // 첫 번째 연도로 설정
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
      setFilteredData([]);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const filteredSchedule = filteredData
    .filter((item) => item.year === calendarYear && item.month === clickedMonth + 1)
    .reduce((acc, item) => {
      if (!acc[item.startDate]) {
        acc[item.startDate] = [];
      }
      acc[item.startDate].push(item);
      return acc;
    }, {});

  // 이전 년도로 이동
  const handlePreviousYear = () => {
    setCalendarYear((prevYear) => prevYear - 1);
  };

  // 다음 년도로 이동
  const handleNextYear = () => {
    setCalendarYear((prevYear) => prevYear + 1);
  };

  return (
    <div className="w-full px-72 flex flex-col">
      {/* 연도 표시 */}
      <div className="w-full font-bold text-gray-800 text-2xl flex justify-center my-8 gap-32">
        <div
          onClick={handlePreviousYear}
          className="cursor-pointer"
        >
          <MdOutlineKeyboardArrowLeft/>
        </div>
        {calendarYear || "연도 불러오는 중..."}
        <div
          onClick={handleNextYear}
          className="cursor-pointer"
        >
          <MdOutlineKeyboardArrowRight/>
        </div>
      </div>

      {/* 월 표시 */}
      <div className="w-full border border-x-0 border-t-gray-400 flex flex-wrap justify-center gap-3">
        {months.map((month, index) => (
          <button
            key={index}
            className={`flex-grow text-center px-4 py-2 ${
              clickedMonth === index ? "text-gray-800" : "text-gray-400"
            }`}
            onClick={() => setClickedMonth(index)}
          >
            {month}
          </button>
        ))}
      </div>

      {/* 일정 표시 */}
      <div className="w-full h-96 overflow-y-scroll">
        <div className="w-full ">
          {Object.keys(filteredSchedule).length > 0 ? (
            Object.entries(filteredSchedule).map(([date, matches], idx) => (
              <div key={idx}>
                <div className="font-bold bg-gray-100 p-2 border border-t-gray-400 border-x-0">
                  {date}
                </div>
                {matches.map((match, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center w-full p-2 border border-t-gray-400 border-x-0"
                  >
                    {/* 왼쪽 정렬 그룹 */}
                    <div className="flex items-center gap-2">
                      <div className="text-sm">{match.startTime}</div>
                      <div className="text-gray-400 text-xs">{match.leagueName}</div>
                      <div className="text-gray-400 text-xs">
                        [{match.sportType}]
                      </div>
                      <div className="ml-2">
                        <StatusIndicator status={match.betTimeType || "예측종료"}/>
                      </div>
                    </div>

                    {/* 가운데 정렬 */}
                    <div className="flex items-center gap-4">
                      <div className="flex flex-row items-center gap-4">
                        <img
                          src={match.homeTeamIconImageUrl}
                          alt={match.homeTeamName}
                          className="h-8 w-8"
                        />
                        {match.homeTeamName}
                      </div>
                      <div className="text-lg font-bold text-gray-600">vs</div>
                      <div className="flex flex-row items-center gap-4">
                        {match.awayTeamName}
                        <img
                          src={match.awayTeamIconImageUrl}
                          alt={match.awayTeamName}
                          className="h-8 w-8"
                        />
                      </div>
                    </div>

                    {/* 오른쪽 정렬 */}
                    <div className="text-xs text-gray-800">장소: {match.place}</div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="flex justify-center mt-12">
              해당 월에 경기가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
