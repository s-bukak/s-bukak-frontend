import React, {useState, useEffect} from "react";
import StatusIndicator from "../../components/StateIndecator"; // StatusIndicator 컴포넌트 임포트
import {MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight} from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

export default function Schedule() {
  const months = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월",
  ];
  const currentMonth = new Date().getMonth(); // 현재 월
  const [clickedMonth, setClickedMonth] = useState(currentMonth); // 초기값을 현재 월로 설정
  const [filteredData, setFilteredData] = useState([]);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear()); // 현재 연도로 초기화

  const fetchSchedule = async () => {
    try {
      const response = await axiosInstance.get(`schedule`);

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
    <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24 pb-20 flex flex-col">
      {/* 연도 표시 */}
      <div className="w-full font-bold text-gray-800 text-xl sm:text-2xl flex justify-center my-8 gap-16 sm:gap-32">
        <div onClick={handlePreviousYear} className="cursor-pointer">
          <MdOutlineKeyboardArrowLeft/>
        </div>
        {calendarYear || "연도 불러오는 중..."}
        <div onClick={handleNextYear} className="cursor-pointer">
          <MdOutlineKeyboardArrowRight/>
        </div>
      </div>

      {/* 월 표시 */}
      <div className="w-full border border-x-0 border-t-gray-400 flex flex-wrap justify-center gap-2 sm:gap-3">
        {months.map((month, index) => (
          <button
            key={index}
            className={`flex-grow text-center px-2 py-1 sm:px-4 sm:py-2 ${
              clickedMonth === index ? "text-gray-800" : "text-gray-400"
            }`}
            onClick={() => setClickedMonth(index)}
          >
            {month}
          </button>
        ))}
      </div>

      {/* 일정 표시 */}
      <div className="w-full h-full">
        <div className="w-full ">
          {Object.keys(filteredSchedule).length > 0 ? (
            Object.entries(filteredSchedule).map(([date, matches], idx) => (
              <div key={idx}>
                <div className="font-bold bg-gray-100 p-2 text-sm sm:text-base border border-t-gray-400 border-x-0">
                  {date}
                </div>
                {matches.map((match, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row justify-center items-center w-full p-2 border border-t-gray-400 border-x-0"
                  >
                    <div className="flex items-center w-full sm:flex-[9] flex-col sm:flex-row gap-2">
                      {/* 왼쪽 섹션 */}
                      <div className="flex flex-row items-center gap-2 mr-auto">
                        <div className="text-xs sm:text-sm">{match.startTime}</div>
                        <div className="text-gray-400 text-xs">{match.leagueName}</div>
                        <div className="text-gray-400 text-xs">
                          [{match.sportType}]
                        </div>
                        <div className="ml-2">
                          <StatusIndicator status={match.betTimeType || "예측종료"}/>
                        </div>
                      </div>
                      <img
                        src={match.homeTeamIconImageUrl}
                        alt={match.homeTeamName}
                        className="h-6 w-6 sm:h-8 sm:w-8"
                      />
                      <span className="text-xs sm:text-sm">{match.homeTeamName}</span>
                    </div>

                    {/* 'vs' 텍스트 */}
                    <div
                      className="flex items-center justify-center flex-[2] text-sm sm:text-lg font-bold text-gray-600 my-2 sm:my-0">
                      vs
                    </div>

                    {/* 오른쪽 섹션 */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 flex-[9] border-gray-100">
                      <span className="text-xs sm:text-sm">{match.awayTeamName}</span>
                      <img
                        src={match.awayTeamIconImageUrl}
                        alt={match.awayTeamName}
                        className="h-6 w-6 sm:h-8 sm:w-8"
                      />
                      <div className="text-xs sm:text-sm text-gray-800 ml-auto">장소: {match.place}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="flex justify-center mt-12 text-xs sm:text-base">
              진행된 경기 혹은 예정된 경기가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
