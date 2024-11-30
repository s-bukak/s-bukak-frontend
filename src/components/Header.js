import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useRecoilState } from "recoil";
import { activeSportTabState, teamIdState } from "../state/sportTabState";
import { useNavigate, useLocation } from "react-router-dom";

// 팀명 배열
const soccerTeams = [
  "aigu",
  "colsc",
  "cs-shooting",
  "fc-scale",
  "focus",
  "forest",
  "kesa",
  "kkyamelleon",
  "ns",
  "one-mind",
  "pantasista",
  "real-moment",
  "shadow",
  "ares",
  "bas",
  "fc-bit",
  "fiav",
  "forty-one",
  "gongsalang",
  "iasc",
  "kafa",
  "loniz",
  "nepist",
  "vipers",
];
const basketballTeams = [
  "tab",
  "fwd",
  "ceo",
  "fm",
  "mbl",
  "steb",
  "kuba",
  "gg",
  "courtist",
  "cs-jumping",
  "warning",
  "man-q",
  "a-tempo",
];

// 애니메이션 정의
const bounce = keyframes`
    0% {
        transform: translateY(-5px);
        opacity: 0;
    }
    60% {
        transform: translateY(5px);
        opacity: 1;
    }
    100% {
        transform: translateY(0);
    }
`;

// 애니메이션이 적용된 컨테이너
const AnimatedContainer = styled.div`
  animation: ${bounce} 0.5s ease-in-out;
`;

const Header = () => {
  const [activeSportTab, setActiveSportTab] =
    useRecoilState(activeSportTabState);
  const [teamId, setTeamId] = useRecoilState(teamIdState);
  const location = useLocation();
  const [activeMenuTab, setActiveMenuTab] = useState("home");
  const [showTeamLogos, setShowTeamLogos] = useState(false);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const handleTeamClick = () => {
    setShowTeamLogos(true);
    setActiveMenuTab("team");
    navigate("/team");
  };

  // 새로고침시 헤더 선택값으로 현재 페이지 유지
  useEffect(() => {
    const path = location.pathname.split("/")[1];
    setActiveMenuTab(path || "home");
  }, [location]);

  // 팀페이지 새로고침시 팀 로고 헤더 표시 유지
  useEffect(() => {
    if (location.pathname.includes("/team")) {
      setShowTeamLogos(true);
    } else {
      setShowTeamLogos(false);
    }
  }, [location.pathname]);

  const handleTabClick = (tab) => {
    if (tab !== "team") {
      setShowTeamLogos(false);
      setTeamId(0); // teamId를 0으로 초기화
    }
    setActiveMenuTab(tab);
    navigate(`/${tab}`);
  };

  // showTeamLogos가 true로 설정될 때 스크롤을 중앙으로 이동
  useEffect(() => {
    if (showTeamLogos && scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const clientWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollLeft = (scrollWidth - clientWidth) / 2;
    }
  }, [showTeamLogos]);

  // 팀명 배열을 기반으로 로고 가져오기
  const getTeamLogo = (team) => {
    return require(`../assets/logos/${activeSportTab}/${team}.svg`);
  };

  const teamNames = activeSportTab === "soccer" ? soccerTeams : basketballTeams;

  return (
    <div>
      <header className="bg-gray-800 text-gray-400 p-4 shadow-md font-bold">
        <div className="container mx-auto flex justify-between items-center">
          {/* 로고 */}
          <div className="flex items-center space-x-4">
            <img src="/logo.svg" alt="Logo" className="w-40" />
          </div>

          {/* 로그인 & 회원가입 */}
          <div className="space-x-4 text-white text-sm">
            <button
              onClick={() => handleTabClick("signin")}
              className="hover:underline"
            >
              {" "}
              로그인{" "}
            </button>
            <button
              onClick={() => handleTabClick("signup")}
              className="hover:underline"
            >
              {" "}
              회원가입{" "}
            </button>
          </div>
        </div>

        {/* 축구 & 농구 탭 */}
        <div className="container mx-auto mt-2 flex justify-center">
          <nav className="flex space-x-8 text-lg">
            <button
              className={`${activeSportTab === "soccer" ? "text-white" : ""} hover:text-white`}
              onClick={() => {
                setActiveSportTab("soccer");
                handleTabClick("home");
              }}
            >
              축구
            </button>
            <button
              className={`${activeSportTab === "basketball" ? "text-white" : ""} hover:text-white`}
              onClick={() => {
                setActiveSportTab("basketball");
                handleTabClick("home");
              }}
            >
              농구
            </button>
          </nav>
        </div>

        {/* 하단 메뉴 탭 */}
        <div className="container mx-auto my-4 flex justify-center">
          <nav className="flex space-x-8 text-lg">
            <button
              className={`${activeMenuTab === "home" ? "text-white" : ""} hover:text-white`}
              onClick={() => handleTabClick("home")}
            >
              홈
            </button>
            <button
              className={`${activeMenuTab === "community" ? "text-white" : ""} hover:text-white`}
              onClick={() => handleTabClick("community")}
            >
              커뮤니티
            </button>
            <button
              className={`${activeMenuTab === "schedule" ? "text-white" : ""} hover:text-white`}
              onClick={() => handleTabClick("schedule")}
            >
              일정
            </button>
            <button
              className={`${activeMenuTab === "ranking" ? "text-white" : ""} hover:text-white`}
              onClick={() => handleTabClick("ranking")}
            >
              랭킹
            </button>
            <button
              className={`${activeMenuTab === "team" ? "text-white" : ""} hover:text-white`}
              onClick={handleTeamClick}
            >
              팀
            </button>
          </nav>
        </div>
      </header>

      {/* 팀 로고 표시 영역 */}
      {showTeamLogos && (
        <AnimatedContainer
          className="bg-gray-200 flex overflow-x-auto min-w-0 py-4 scrollbar-hide items-center justify-center"
          ref={scrollRef} // 스크롤 컨테이너 참조 연결
        >
          <div className="flex space-x-3">
            {/* 왼쪽 여백 */}
            <div className="flex-shrink-0 w-10"></div>

            {teamNames.map((team, index) => (
              <button
                key={index}
                onClick={() => {
                  const calculatedTeamId =
                    activeSportTab === "soccer" ? index + 1 : index + 25;
                  navigate(`/team/${calculatedTeamId}`); // 계산된 값 사용
                  setTeamId(calculatedTeamId); // 상태 업데이트
                }}
                className="flex items-center justify-center flex-shrink-0"
              >
                <img
                  src={getTeamLogo(team)}
                  alt={team}
                  className="h-14 w-14 flex-shrink-0"
                />
              </button>
            ))}

            {/* 오른쪽 여백 */}
            <div className="flex-shrink-0 w-10"></div>
          </div>
        </AnimatedContainer>
      )}
    </div>
  );
};

export default Header;
