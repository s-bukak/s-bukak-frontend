import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { soccerTeamLogos, basketballTeamLogos } from "../../data/teamLogos";
import { getTeamLogoPath } from "../../utils/getTeamLogoPath";

function Cell({ children, width }) {
    return (
        <div className={`flex justify-center items-center ${width}`}>
            {children}
        </div>
    );
}

function Row({ teamData, activeTab }) {
    const teamLogos = activeTab === "soccer" ? soccerTeamLogos : basketballTeamLogos;
    const logoData = teamLogos.find((team) => team.name === teamData.teamName);
    const fileName = logoData ? logoData.fileName : null;
    const logoSrc = fileName ? getTeamLogoPath(activeTab, fileName) : null;

    return (
        <div className="bg-gray-200 flex flex-row items-center min-h-[60px] text-gray-700 text-sm py-2 rounded-xl">
            <Cell width="w-[5%]">{teamData.rank}</Cell>
            <Cell width="w-[30%]">
                <img src={logoSrc} alt={`${teamData.teamName} 로고`} className="w-6 h-6 mr-2"/>
                <span>{teamData.teamName}</span>
            </Cell>
            <Cell width="w-[10%]">{teamData.points}</Cell>
            <Cell width="w-[5%]">{teamData.wins}</Cell>
            {activeTab === "soccer" && <Cell width="w-[5%]">{teamData.draws}</Cell>}
            <Cell width="w-[5%]">{teamData.losses}</Cell>
            <Cell width="w-[10%]">{teamData.matchesPlayed}</Cell>
            {activeTab === "soccer" ? (
                <>
                    <Cell width="w-[10%]">{teamData.goalsScored}</Cell>
                    <Cell width="w-[10%]">{teamData.goalDifference}</Cell>
                </>
            ) : (
                <Cell width="w-[10%]">{teamData.goalDifference}</Cell>
            )}
            <div className="w-[20%] flex justify-center items-center space-x-1">
                {teamData.matchResults.map((result, index) => (
                    result === 1 ? (
                        <FaCheckCircle key={index} className="text-green-500 bg-white rounded-full text-sm" />
                    ) : (
                        <FaTimesCircle key={index} className="text-red-500 bg-white rounded-full text-sm" />
                    )
                ))}
            </div>
        </div>
    );
}

export default Row;
