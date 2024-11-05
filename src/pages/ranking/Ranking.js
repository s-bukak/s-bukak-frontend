import React, { useState } from 'react';
import Row from "../../components/ranking/Row";
import { useRecoilValue } from "recoil";
import { activeSportTabState } from "../../state/sportTabState";
import { soccerRankingData_S, soccerRankingData_H, basketballRankingData_S, basketballRankingData_H } from "../../data/ranking";

function Header({ isSoccer }) {
    return (
        <div className="flex flex-row items-center pb-2 text-gray-700 text-sm">
            <div className="w-[5%] text-center">순위</div>
            <div className="w-[30%] text-center">팀명</div>
            <div className="w-[10%] text-center">승점</div>
            <div className="w-[5%] text-center">승</div>
            {isSoccer && <div className="w-[5%] text-center">무</div>}
            <div className="w-[5%] text-center">패</div>
            <div className="w-[10%] text-center">경기수</div>
            {isSoccer ? (
                <>
                    <div className="w-[10%] text-center">득점</div>
                    <div className="w-[10%] text-center">골득실</div>
                </>
            ) : (
                <div className="w-[10%] text-center">득실차</div>
            )}
            <div className="w-[20%] text-center">경기 전적</div>
        </div>
    );
}


export default function Ranking() {
    const activeSportTab = useRecoilValue(activeSportTabState);
    const [selectedLeague, setSelectedLeague] = useState('성곡리그');

    const handleSelectChange = (event) => {
        setSelectedLeague(event.target.value);
    };

    const isSoccerTab = activeSportTab === 'soccer';
    const isSungGokLeague = selectedLeague === '성곡리그';

    return (
        <div className="px-52 py-20">
            <div className="text-3xl font-bold">🏆 2024 북악리그 순위</div>
            <select
                value={selectedLeague}
                onChange={handleSelectChange}
                className="bg-transparent border-none outline-none text-md font-bold my-8"
                style={{ borderBottom: '1px solid transparent' }}
            >
                <option value="성곡리그">성곡리그</option>
                <option value="해공리그">해공리그</option>
            </select>

            <Header isSoccer={isSoccerTab} />

            {isSoccerTab ? (
                (isSungGokLeague ? soccerRankingData_S : soccerRankingData_H).map((team, index) => (
                    <div className="my-2" key={index}>
                        <Row teamData={team} activeTab={activeSportTab} />
                    </div>
                ))
            ) : (
                (isSungGokLeague ? basketballRankingData_S : basketballRankingData_H).map((team, index) => (
                    <div className="my-2" key={index}>
                        <Row teamData={team} activeTab={activeSportTab} />
                    </div>
                ))
            )}
        </div>
    );
}
