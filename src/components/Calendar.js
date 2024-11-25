import React, { useState, useEffect } from "react";
import CalendarLeft from "../assets/icons/calendar-left.svg";
import CalendarRight from "../assets/icons/calendar-right.svg";
import axios from "axios";
import { DOMAIN_NAME, TOKEN_NAME } from "../App";

export default function Calendar() {
  const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [calendarData, setCalendarData] = useState([]); // API 데이터를 저장할 상태
  const [calendarYear, setCalendarYear] = useState(null); // 백엔드에서 받아온 year

  // 날짜 파싱 함수
  // "11월 02일"과 같은 startDate 문자열을 실제 날짜 객체로 변환
  const parseDate = (startDate, year) => {
    const [monthText, dayText] = startDate.split(" ");
    const month = parseInt(monthText.replace("월", ""), 10) - 1;
    const day = parseInt(dayText.replace("일", ""), 10);
    return new Date(year, month, day);
  };

  // 뒤로가기 버튼 클릭
  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) {
      setCalendarYear((prev) => (prev ? prev - 1 : today.getFullYear() - 1)); // 연도 변경
    }
    setSelectedDate(null); // 월이 변경되면 선택된 날짜 초기화
  };

  // 앞으로가기 버튼 클릭
  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) {
      setCalendarYear((prev) => (prev ? prev + 1 : today.getFullYear() + 1)); // 연도 변경
    }
    setSelectedDate(null); // 월이 변경되면 선택된 날짜 초기화
  };

  // API 데이터 가져오기
  // 백엔드에서 일정 데이터를 가져오고, 첫 번째 year 값을 calendarYear로 설정
  const fetchCalendarData = async () => {
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
            scheduleId: schedule.scheduleId,
            year: yearData.year,
            month: monthData.month,
            startDate: schedule.startDate,
            startTime: schedule.startTime,
            sportType: schedule.sportType,
            homeTeamName: schedule.homeTeamName,
            awayTeamName: schedule.awayTeamName,
          }))
        )
      );

      // 첫 번째 year 값을 설정
      if (schedulesYear.length > 0) {
        setCalendarYear(schedulesYear[0].year);
      }

      setCalendarData(formattedData); // 상태에 저장
    } catch (error) {
      console.error("Failed to fetch calendar data:", error);
    }
  };

  // 컴포넌트가 렌더링될 때 데이터 가져오기
  useEffect(() => {
    fetchCalendarData();
  }, []);

  // 특정 월의 달력을 생성하는 함수
  const generateCalendar = (month) => {
    const year = calendarYear || today.getFullYear(); // calendarYear가 없으면 현재 연도 사용
    const firstDay = new Date(year, month, 1).getDay(); // 해당 월의 1일의 요일
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // 해당 월의 총 일수
    const prevMonthDays = new Date(year, month, 0).getDate(); // 이전 월의 총 일수
    const nextMonthDays = 42 - (firstDay + daysInMonth); // 다음 월의 표시할 일 수
    const calendar = [];
    let week = [];

    // 해당 날짜에 이벤트가 있는지 확인하는 함수
    const checkHasEvent = (day, type) => {
      if (type !== "current") return false; // 현재 월이 아닌 날짜는 이벤트 표시 안 함
      return calendarData.some((event) => {
        const eventDate = parseDate(event.startDate, event.year);
        return (
          eventDate.getFullYear() === year &&
          eventDate.getMonth() === month &&
          eventDate.getDate() === day
        );
      });
    };

    // 이전 월의 날짜 추가
    for (let i = firstDay - 1; i >= 0; i--) {
      week.push({ day: prevMonthDays - i, type: "prev", hasEvent: false });
    }

    // 현재 월의 날짜 추가
    for (let day = 1; day <= daysInMonth; day++) {
      week.push({ day, type: "current", hasEvent: checkHasEvent(day, "current") });
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    // 다음 월의 날짜 추가
    for (let i = 1; i <= nextMonthDays; i++) {
      week.push({ day: i, type: "next", hasEvent: false });
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    return calendar;
  };

  const calendarViewData = generateCalendar(currentMonth);

  // 선택된 날짜의 이벤트 필터링
  const filteredEvents = calendarData.filter((event) => {
    const year = calendarYear || today.getFullYear(); // calendarYear가 없으면 현재 연도 사용
    const eventDate = parseDate(event.startDate, event.year);
    return (
      eventDate.getFullYear() === year &&
      eventDate.getMonth() === currentMonth &&
      eventDate.getDate() === selectedDate
    );
  });

  return (
    <div className="w-full h-auto flex flex-col items-center rounded-2xl shadow-md p-4 bg-gray-100">
      {/* 월 변경 섹션 */}
      <div className="w-full h-full flex items-center justify-between px-5">
        <button onClick={handlePrevMonth} className="w-6 h-6">
          <img src={CalendarLeft} alt="Previous Month" className="w-full h-full" />
        </button>
        <div className="text-gray-800 text-2xl font-bold">{calendarYear}년 {months[currentMonth]}</div>
        <button onClick={handleNextMonth} className="w-6 h-6">
          <img src={CalendarRight} alt="Next Month" className="w-full h-full" />
        </button>
      </div>

      {/* 달력 섹션 */}
      <div className="w-full grid grid-cols-7 gap-1 p-2 border border-y-gray-500 border-x-0">
        {/* 요일 헤더 */}
        {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
          <div
            key={index}
            className={`text-center font-medium ${
              index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : ""
            }`}
          >
            {day}
          </div>
        ))}
        {/* 달력 날짜 */}
        {calendarViewData.map((week, weekIndex) =>
          week.map(({ day, type, hasEvent }, dayIndex) => (
            <div className="flex flex-col items-center" key={`${weekIndex}-${dayIndex}`}>
              <div
                className={`relative h-10 w-10 flex items-center justify-center cursor-pointer rounded-full ${
                  dayIndex === 0
                    ? "text-red-500"
                    : dayIndex === 6
                      ? "text-blue-500"
                      : "text-gray-800"
                } ${
                  type === "prev" || type === "next"
                    ? "text-opacity-20"
                    : day === selectedDate
                      ? "bg-gray-800 text-white"
                      : day === today.getDate() &&
                      currentMonth === today.getMonth() &&
                      calendarYear === today.getFullYear()
                        ? "bg-gray-300"
                        : "bg-gray-100"
                }`}
                onClick={() => type === "current" && setSelectedDate(day)}
              >
                {day || ""}
              </div>
              {/* 빨간 점 */}
              {hasEvent && (
                <div className="mt-0.5 h-1 w-1 bg-red-500 rounded-full"></div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 선택된 날짜의 이벤트 */}
      <div className="w-full bg-gray-100 p-4 mt-4 rounded-lg">
        <div className="font-bold mb-2">
          {months[currentMonth]} {selectedDate}일 일정
        </div>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-gray-500 mb-1"
            >
              <div className="h-1 w-1 bg-gray-500 rounded-full"></div>
              <div>[{event.sportType}]</div>
              <div>{event.startTime}</div>
              <div>
                {event.homeTeamName} vs {event.awayTeamName}
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500">일정이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
