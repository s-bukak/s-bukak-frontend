import React from "react";
import { IoMdCheckmark, IoMdClose, IoMdRemove } from "react-icons/io";

function Cell({ children, width }) {
    return (
        <div className={`flex justify-center items-center ${width}`}>
            {children}
        </div>
    );
}

function Row({ teamData, activeTab }) {
    return (
        <div className="bg-gray-100 flex flex-row items-center min-h-[60px] text-gray-700 text-sm py-2 rounded-xl">
            <Cell width="w-[5%]">{teamData.ranking}</Cell>
            <Cell width="w-[30%]">
                <img src={teamData.iconImageUrl} alt={`${teamData.teamName} 로고`} className="w-12"/>
                <span>{teamData.teamName}</span>
            </Cell>
            <Cell width="w-[10%]">{teamData.points}</Cell>
            <Cell width="w-[5%]">{teamData.wins}</Cell>
            {activeTab === "soccer" && <Cell width="w-[5%]">{teamData.draws}</Cell>}
            <Cell width="w-[5%]">{teamData.losses}</Cell>
            <Cell width="w-[10%]">{teamData.matches}</Cell>
            {activeTab === "soccer" ? (
                <>
                    <Cell width="w-[10%]">{teamData.goals}</Cell>
                    <Cell width="w-[10%]">{teamData.goalsDifference}</Cell>
                </>
            ) : (
                <Cell width="w-[10%]">{teamData.goalsDifference}</Cell>
            )}
            <div className="w-[20%] flex justify-center items-center space-x-1">
                {teamData.recentMatches.map((result, index) => (
                    result === 1 ? (
                        <IoMdCheckmark key={index} className="text-white font-extrabold bg-green-500 rounded-full text-sm" />
                    ) : result === 0 ? (
                        <IoMdClose key={index} className="text-white font-extrabold bg-red-500 rounded-full text-sm" />
                    ) : (
                        <IoMdRemove key={index} className="text-white bg-gray-400 rounded-full text-sm" />
                    )
                ))}
            </div>
        </div>
    );
}

export default Row;
