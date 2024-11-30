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

  // 새로고침시 헤더 선택값으로 현재 페이지 유지
  useEffect(() => {
    const path = location.pathname.split("/")[1];
    setActiveMenuTab(path || "home");
  }, [location]);

  // 팀페이지 새로고침시 팀 로고 헤더 표시 유지
  useEffect(() => {
    setShowTeamLogos(location.pathname.includes("/team"));
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
      const { scrollWidth, clientWidth } = scrollRef.current;
      scrollRef.current.scrollLeft = (scrollWidth - clientWidth) / 2;
    }
  }, [showTeamLogos]);

  // 팀명 배열을 기반으로 로고 가져오기
  const getTeamLogo = (team) => {
    return require(`../assets/logos/${activeSportTab}/${team}.svg`);
  };

  const teamNames = activeSportTab === "soccer" ? soccerTeams : basketballTeams;

  const handleLogoClick = (team) => {
    setActiveMenuTab("team");
    const calculatedTeamId =
      activeSportTab === "soccer"
        ? teamNames.indexOf(team) + 1
        : teamNames.indexOf(team) + 25;
    navigate(`/team/${calculatedTeamId}`);
    setTeamId(calculatedTeamId);
    setShowTeamLogos(true);
  };

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
              로그인
            </button>
            <button
              onClick={() => handleTabClick("signup")}
              className="hover:underline"
            >
              회원가입
            </button>
          </div>
        </div>

        {/* 축구 & 농구 탭 */}
        <div className="container mx-auto mt-2 flex justify-center">
          <nav className="flex space-x-8 text-lg">
            {["soccer", "basketball"].map((tab) => (
              <button
                key={tab}
                className={`${activeSportTab === tab ? "text-white" : ""} hover:text-white`}
                onClick={() => {
                  setActiveSportTab(tab);
                  handleTabClick("home");
                }}
              >
                {tab === "soccer" ? "축구" : "농구"}
              </button>
            ))}
          </nav>
        </div>

        {/* 하단 메뉴 탭 */}
        <div className="container mx-auto my-4 flex justify-center">
          <nav className="flex space-x-8 text-lg">
            <button
              className={`${activeMenuTab === "home" ? "text-white" : ""} hover:text-white`}
              onClick={() => handleTabClick("home")}
              onMouseEnter={() =>
                activeMenuTab !== "team" && setShowTeamLogos(false)
              }
            >
              홈
            </button>
            <button
              className={`${activeMenuTab === "community" ? "text-white" : ""} hover:text-white`}
              onClick={() => handleTabClick("community")}
              onMouseEnter={() =>
                activeMenuTab !== "team" && setShowTeamLogos(false)
              }
            >
              커뮤니티
            </button>
            <button
              className={`${activeMenuTab === "schedule" ? "text-white" : ""} hover:text-white`}
              onClick={() => handleTabClick("schedule")}
              onMouseEnter={() =>
                activeMenuTab !== "team" && setShowTeamLogos(false)
              }
            >
              일정
            </button>
            <button
              className={`${activeMenuTab === "ranking" ? "text-white" : ""} hover:text-white`}
              onClick={() => handleTabClick("ranking")}
              onMouseEnter={() =>
                activeMenuTab !== "team" && setShowTeamLogos(false)
              }
            >
              랭킹
            </button>
            <button
              className={`${activeMenuTab === "team" ? "text-white" : ""} hover:text-white`}
              onMouseEnter={() => setShowTeamLogos(true)}
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
          onMouseEnter={() => setShowTeamLogos(true)} // 팀 버튼 또는 로고 영역에 마우스를 올리면 로고 보이기
          onMouseLeave={() =>
            !location.pathname.includes("/team") && setShowTeamLogos(false)
          }
        >
          <div className="flex space-x-3">
            {/* 왼쪽 여백 */}
            <div className="flex-shrink-0 w-10"></div>

            {teamNames.map((team, index) => (
              <button
                key={index}
                onClick={() => handleLogoClick(team)}
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
