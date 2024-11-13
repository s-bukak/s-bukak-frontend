import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { activeSportTabState } from '../../state/sportTabState';
import { soccerRankingData_S, soccerRankingData_H, basketballRankingData_S, basketballRankingData_H } from '../../data/ranking';
import { soccerTeamLogos, basketballTeamLogos } from '../../data/teamLogos';
import { getTeamLogoPath } from '../../utils/getTeamLogoPath';
import { FaRankingStar } from "react-icons/fa6";

const Ranking = () => {
    const activeSportTab = useRecoilValue(activeSportTabState);
    const [selectedLeague, setSelectedLeague] = useState('성곡리그');

    // Determine the correct data set based on sport type and league selection
    const rankingData = activeSportTab === 'soccer'
        ? (selectedLeague === '성곡리그' ? soccerRankingData_S : soccerRankingData_H)
        : (selectedLeague === '성곡리그' ? basketballRankingData_S : basketballRankingData_H);

    // Determine which logo set to use based on the sport tab
    const teamLogos = activeSportTab === 'soccer' ? soccerTeamLogos : basketballTeamLogos;

    const handleLeagueChange = () => {
        setSelectedLeague((prevLeague) => (prevLeague === '성곡리그' ? '해공리그' : '성곡리그'));
    };

    return (
        <div className="bg-gradient-to-b from-teal-100 to-gray-200 px-6 pt-8 pb-10 rounded-xl shadow-md relative">
            {/* League Change Button */}
            <FaRankingStar
                onClick={handleLeagueChange}
                className="absolute top-10 right-8 text-xl cursor-pointer"
            />

            {/* Header */}
            <div className="flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold text-sky-600"># {selectedLeague}</h2>
                <p className="text-gray-600 text-xs mb-6">* 2024년 4월 30일 기준</p>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-3 text-center font-semibold border-b border-gray-400 pb-2">
                <div>순위</div>
                <div>TEAM</div>
                <div>승점</div>
            </div>

            {/* Team Rows */}
            {rankingData.map((team, index) => {
                const logoData = teamLogos.find((logo) => logo.name === team.teamName);
                const logoSrc = logoData ? getTeamLogoPath(activeSportTab, logoData.fileName) : null;

                return (
                    <div key={team.rank}
                         className="grid grid-cols-3 items-center text-center py-2 border-b border-gray-400 text-sm">
                        <div>{team.rank}</div>
                        <div className="flex items-center justify-center space-x-2">
                            {logoSrc && <img src={logoSrc} alt={`${team.teamName} 로고`} className="w-6 h-6"/>}
                            <span>{team.teamName}</span>
                        </div>
                        <div className="font-bold">{team.points}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default Ranking;
