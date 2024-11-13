import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useRecoilState } from 'recoil';
import { activeSportTabState } from '../state/sportTabState'; // Recoil 상태 불러오기
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 추가

// 팀명 배열
const soccerTeams = ['aigu', 'ares', 'bas', 'colsc', 'cs-shooting', 'fc-bit', 'fc-scale', 'fiav',
    'focus', 'forest', 'forty-one', 'gongsalang', 'iasc', 'kafa', 'kesa', 'kkyamelleon', 'loniz', 'nepist',
    'ns', 'one-mind', 'pantasista', 'real-moment', 'shadow', 'vipers'];
const basketballTeams = ['a-tempo', 'ceo', 'courtist', 'cs-jumping', 'fm', 'fwd', 'gg', 'kuba',
    'man-q', 'mbl', 'step', 'tab', 'warning'];

// 애니메이션 정의
const bounce = keyframes`
    0% {
        transform: translateY(0);
        opacity: 0;
    }
    60% {
        transform: translateY(-1px);
        opacity: 1;
    }
    100% {
        transform: translateY(0);
    }
`;

// 스크롤바 숨기기 위한 스타일 컴포넌트
const ScrollContainer = styled.div`
    background-color: #e5e7eb;
    width: 100%;
    overflow-x: auto;
    display: flex;
    justify-content: center;
    transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
    animation: ${bounce} 0.5s ease-in-out;

    &::-webkit-scrollbar {
        display: none;
    }

    & {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
`;

const Header = () => {
    const [activeSportTab, setActiveSportTab] = useRecoilState(activeSportTabState); // Recoil 상태 사용
    const [activeMenuTab, setActiveMenuTab] = useState('home');
    const [showTeamLogos, setShowTeamLogos] = useState(false);
    const navigate = useNavigate(); // useNavigate 훅 사용

    const handleTeamClick = () => {
        setShowTeamLogos(true);
        setActiveMenuTab('team');
        navigate('/team'); // 페이지 이동
    };

    const handleTabClick = (tab) => {
        if (tab !== 'team') {
            setShowTeamLogos(false);
        }
        setActiveMenuTab(tab);
        navigate(`/${tab}`); // 페이지 이동
    };

    // 팀명 배열을 기반으로 로고 가져오기
    const getTeamLogo = (team) => {
        return require(`../assets/logos/${activeSportTab}/${team}.svg`);
    };

    const teamNames = activeSportTab === 'soccer' ? soccerTeams : basketballTeams;

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
                        <button onClick={() => handleTabClick('signin')}> 로그인 </button>
                        <button onClick={() => handleTabClick('signup')}> 회원가입 </button>
                    </div>
                </div>

                {/* 축구 & 농구 탭 */}
                <div className="container mx-auto mt-2 flex justify-center">
                    <nav className="flex space-x-8 text-lg">
                        <button
                            className={`${activeSportTab === 'soccer' ? 'text-white' : ''} hover:text-white`}
                            onClick={() => {
                                setActiveSportTab('soccer');
                                handleTabClick('home'); // 홈으로 리셋
                            }}
                        >
                            축구
                        </button>
                        <button
                            className={`${activeSportTab === 'basketball' ? 'text-white' : ''} hover:text-white`}
                            onClick={() => {
                                setActiveSportTab('basketball');
                                handleTabClick('home'); // 홈으로 리셋
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
                            className={`${activeMenuTab === 'home' ? 'text-white' : ''} hover:text-white`}
                            onClick={() => handleTabClick('home')}
                        >
                            홈
                        </button>
                        <button
                            className={`${activeMenuTab === 'community' ? 'text-white' : ''} hover:text-white`}
                            onClick={() => handleTabClick('free-community')}
                        >
                            커뮤니티
                        </button>
                        <button
                            className={`${activeMenuTab === 'schedule' ? 'text-white' : ''} hover:text-white`}
                            onClick={() => handleTabClick('schedule')}
                        >
                            일정
                        </button>
                        <button
                            className={`${activeMenuTab === 'ranking' ? 'text-white' : ''} hover:text-white`}
                            onClick={() => handleTabClick('ranking')}
                        >
                            랭킹
                        </button>
                        <button
                            className={`${activeMenuTab === 'team' ? 'text-white' : ''} hover:text-white`}
                            onClick={handleTeamClick}
                        >
                            팀
                        </button>
                    </nav>
                </div>
            </header>

            {/* 팀 로고 표시 영역 */}
            {showTeamLogos && (
                <ScrollContainer
                    style={{
                        transform: showTeamLogos ? 'translateY(0)' : 'translateY(-10px)',
                        opacity: showTeamLogos ? 1 : 0,
                    }}
                >
                    <div className={`flex space-x-3 ${activeSportTab === 'basketball' ? 'py-4' : 'py-3'} min-w-[max-content]`}>
                        {teamNames.map((team, index) => (
                            <button
                                key={index}
                                onClick={() => navigate(`/team/${team}`)} // navigate로 페이지 이동
                                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} // 스타일 적용
                            >
                                <img
                                    src={getTeamLogo(team)}
                                    alt={team}
                                    style={{ height: activeSportTab === 'soccer' ? '60px' : '52px', width: 'auto' }}
                                />
                            </button>
                        ))}
                    </div>
                </ScrollContainer>
            )}
        </div>
    );
};

export default Header;
