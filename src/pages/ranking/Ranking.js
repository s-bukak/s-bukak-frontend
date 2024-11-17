import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Row from "../../components/ranking/Row";
import { useRecoilValue } from "recoil";
import { activeSportTabState } from "../../state/sportTabState";
import { DOMAIN_NAME, TOKEN_NAME } from "../../App";

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
    const [rankingData, setRankingData] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSelectChange = (event) => {
        setSelectedLeague(event.target.value);
    };

    useEffect(() => {
        const fetchRankingData = async () => {
            try {
                const sportType = activeSportTab === 'soccer' ? 'SOCCER' : 'BASKETBALL';
                const response = await axios.get(`${DOMAIN_NAME}/ranking?sportType=${sportType}`, {
                    headers: {
                        Authorization: `Bearer ${TOKEN_NAME}`,
                    },
                });
                const fetchedData = response.data.teams;

                // 선택한 리그에 해당하는 데이터 필터링
                const leagueData = fetchedData.find(
                    league => league.leagueName === selectedLeague
                );

                if (leagueData && leagueData.teams.length > 0) {
                    setRankingData(leagueData.teams); // 해당 리그의 teams 배열 설정
                    setErrorMessage(null);
                } else {
                    setRankingData([]);
                    setErrorMessage("데이터가 없습니다.");
                }
            } catch (error) {
                console.error("Error fetching ranking data:", error);
                setErrorMessage("데이터를 불러오는 중 오류가 발생했습니다.");
            }
        };

        fetchRankingData();
    }, [selectedLeague, activeSportTab]);

    const isSoccerTab = activeSportTab === 'soccer';

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

            {errorMessage ? (
                <div className="text-center text-red-500 mt-4">{errorMessage}</div>
            ) : (
                rankingData.map((team, index) => (
                    <div className="my-2" key={index}>
                        <Row teamData={team} activeTab={activeSportTab} />
                    </div>
                ))
            )}
        </div>
    );
}
