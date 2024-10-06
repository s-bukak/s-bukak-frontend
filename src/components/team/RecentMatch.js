import React from 'react';

// 로고 경로를 자동으로 생성하는 함수
const getTeamLogoPath = (sport, team) => {
    try {
        return require(`../../assets/logos/soccer/${team}.svg`);
    } catch (error) {
        // 로고가 없을 경우 기본 로고 경로로 설정
        return '/assets/logos/default-logo.svg';
    }
};

const RecentMatch = ({ owner, recentMatches }) => {
    return (
        <div className="mb-6">
            <h2 className="text-base font-bold">최근 경기 전적</h2>
            <div className="mt-4">
                {recentMatches.map((match, index) => (
                    <div key={index} className="mb-4">
                        <div className="flex justify-between items-center bg-white py-3 px-16 rounded-lg shadow-sm">
                            <div className="flex flex-col items-center text-center">
                                <img src={owner.logoUrl} alt={owner.name} className="m-1 w-7 h-7 object-cover" />
                                <span className="font-medium text-sm text-center">{owner.name}</span> {/* mt-1로 간격 조절 */}
                            </div>
                            <span className="text-3xl font-medium text-blue-900 mx-6">{match.score}</span>
                            <div className="flex flex-col items-center text-center">
                                <img src={getTeamLogoPath('soccer', match.opponent)} alt={match.opponent}
                                     className="m-1 w-7 h-7 object-cover"/>
                                <span className="font-medium text-sm text-center">{match.opponentName}</span> {/* mt-1로 간격 조절 */}
                            </div>
                        </div>
                        <div
                            className={`p-2 text-sm text-center rounded-b-lg ${index === 0 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
                            {match.league} {match.round} ROUND
                            <div>{match.date}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentMatch;
