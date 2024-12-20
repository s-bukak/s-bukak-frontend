import React, {useEffect, useRef, useState} from "react";
import styled, {keyframes} from "styled-components";
import {useRecoilState} from "recoil";
import {activeSportTabState, teamIdState} from "../state/sportTabState";
import {useLocation, useNavigate} from "react-router-dom";
import {jwtDecode} from 'jwt-decode';
import UpdateInfoModal from './login/UpdateInfoModal'; // 정보 수정 모달 컴포넌트
import DeleteAccountModal from './login/DeleteAccountModal';
import {getToken, removeToken} from "../utils/token"; // 회원 탈퇴 모달 컴포넌트

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
    const [activeMenuTab, setActiveMenuTab] = useState("home");
    const [showTeamLogos, setShowTeamLogos] = useState(false);
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const [userName, setUserName] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userSport, setUserSport] = useState(null);
    const [userCollege, setUserCollege] = useState(null);
    const [userTeam, setUserTeam] = useState(null);
    const [isTeamLeader, setIsTeamLeader] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const location = useLocation(); // 현재 경로 가져오기

    const handleLogoClick = () => {
        navigate('/');
    };

    // 현재 경로를 기반으로 activeMenuTab 업데이트
    useEffect(() => {
        const path = location.pathname.split('/')[1]; // 현재 경로의 첫 번째 부분 가져오기
        setActiveMenuTab(path || 'home');
    }, [location]);

    // 팀페이지 새로고침시 팀 로고 헤더 표시 유지
    useEffect(() => {
        setShowTeamLogos(location.pathname.includes("/team"));
    }, [location.pathname]);

    useEffect(() => {
        const token = getToken();
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserName(decoded.name || "Guest");
                setUserEmail(decoded.email || "Guest@kookmin.ac.kr");
                setUserSport(decoded.sport || "");
                setUserCollege(decoded.college || "");
                setUserTeam(decoded.team || "");
                setIsTeamLeader(decoded.isTeamLeader || false);
            } catch (error) {
                console.error("JWT 디코딩 오류:", error);
                removeToken();
            }
        }
    }, [isUpdateModalOpen]); // `isUpdateModalOpen` 상태 변화 감지

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        setUserName(null);
        navigate('/signin');
    };

    const handleTabClick = (tab) => {
        if (tab === "team") {
            // 팀 탭을 클릭하면 각 스포츠의 첫 번째 팀으로 이동
            const initialTeamId = activeSportTab === "soccer" ? 1 : 25; // 축구는 1, 농구는 25부터 시작
            setTeamId(initialTeamId);
            setShowTeamLogos(true);
            navigate(`/team/${initialTeamId}`);
        } else {
            // 다른 탭 클릭 시 로고 바 숨기기 및 초기화
            setShowTeamLogos(false);
            setTeamId(0);
            navigate(`/${tab}`);
        }
        setActiveMenuTab(tab);
    };


    // showTeamLogos가 true로 설정될 때 스크롤을 중앙으로 이동
    useEffect(() => {
        if (showTeamLogos && scrollRef.current) {
            const {scrollWidth, clientWidth} = scrollRef.current;
            scrollRef.current.scrollLeft = (scrollWidth - clientWidth) / 2;
        }
    }, [showTeamLogos]);

    // 팀명 배열을 기반으로 로고 가져오기
    const getTeamLogo = (team) => {
        return require(`../assets/logos/${activeSportTab}/${team}.svg`);
    };

    const teamNames = activeSportTab === "soccer" ? soccerTeams : basketballTeams;

    const handleTeamLogoClick = (team) => {
        const teamIndex = teamNames.indexOf(team);

        // 팀이 배열에 없는 경우 방어 코드 추가
        if (teamIndex === -1) {
            console.error(`팀 ${team}을 찾을 수 없습니다.`);
            return;
        }

        // 팀 ID 계산
        const calculatedTeamId =
            activeSportTab === "soccer"
                ? teamIndex + 1 // 축구 팀 ID는 1부터 시작
                : teamIndex + 25; // 농구 팀 ID는 25부터 시작

        // 경로 이동 및 상태 업데이트
        setTeamId(calculatedTeamId);
        setActiveMenuTab("team");
        setShowTeamLogos(true);
        navigate(`/team/${calculatedTeamId}`);
    };


    return (
        <div>
            <header className="bg-gray-800 text-gray-400 p-4 shadow-md font-bold">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <img src="/logo.svg" alt="Logo" className="w-40 cursor-pointer" onClick={handleLogoClick}/>
                    </div>

                    <div className="space-x-4 text-white text-sm relative">
                        {userName ? (
                            <>
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="hover:underline font-bold"
                                >
                                    {userName} 님
                                </button>
                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                                        <ul className="py-1 text-gray-700">
                                            <li>
                                                <button
                                                    onClick={() => {
                                                        setIsMenuOpen(false);
                                                        setIsUpdateModalOpen(true);
                                                    }}
                                                    className="block w-full px-4 py-2 text-center hover:bg-gray-100"
                                                >
                                                    정보수정
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full px-4 py-2 text-center hover:bg-gray-100"
                                                >
                                                    로그아웃
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={() => {
                                                        setIsMenuOpen(false);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    className="block w-full px-4 py-2 text-center hover:bg-gray-100"
                                                >
                                                    회원탈퇴
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </>
                        ) : (
                            <button onClick={() => handleTabClick('signin')} className="hover:underline">
                                로그인 및 회원가입
                            </button>
                        )}
                    </div>
                </div>

                <div className="container mx-auto mt-2 flex justify-center">
                    <nav className="flex space-x-8 text-2xl">
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
                            onClick={() => handleTabClick("team")}
                        >
                            팀
                        </button>
                    </nav>

                </div>
            </header>

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
                                onClick={() => handleTeamLogoClick(team)}
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

            {isUpdateModalOpen && (
                <UpdateInfoModal
                    email={userEmail}
                    name={userName}
                    isTeamLeader={isTeamLeader}
                    teamInfo={userCollege + ' ' + userTeam + ' (' + userSport + ')'}
                    onClose={() => setIsUpdateModalOpen(false)}
                    onUpdateSuccess={(newName) => {
                        setUserName(newName);
                        alert("프로필이 성공적으로 수정되었습니다.");
                    }}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteAccountModal
                    email={userEmail}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDeleteSuccess={() => {
                        alert("회원 탈퇴가 완료되었습니다.");
                        navigate("/signin");
                    }}
                />
            )}
        </div>
    );
};

export default Header;
