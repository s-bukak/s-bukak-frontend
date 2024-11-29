import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { activeSportTabState } from '../../state/sportTabState';
import axios from 'axios';
import { DOMAIN_NAME } from "../../App";
import { FaRankingStar } from "react-icons/fa6";

const Ranking = () => {
    const activeSportTab = useRecoilValue(activeSportTabState);
    const [selectedLeague, setSelectedLeague] = useState('성곡리그');
    const [rankingData, setRankingData] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [lastUpdate, setLastUpdate] = useState('');

    const handleLeagueChange = () => {
        setSelectedLeague((prevLeague) => (prevLeague === '성곡리그' ? '해공리그' : '성곡리그'));
    };

    useEffect(() => {
        const fetchRankingData = async () => {
            try {
                const sportType = activeSportTab === 'soccer' ? 'SOCCER' : 'BASKETBALL';
                const response = await axios.get(`${DOMAIN_NAME}/ranking?sportType=${sportType}`);
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

                // lastUpdateDateTime 설정
                const updateDateTime = response.data.lastUpdateDateTime;
                if (updateDateTime) {
                    const dateObj = new Date(updateDateTime);
                    const formattedDate = `${dateObj.getFullYear()}년 ${
                        dateObj.getMonth() + 1
                    }월 ${dateObj.getDate()}일 ${
                        dateObj.getHours()
                    }시 기준`;
                    setLastUpdate(formattedDate);
                }
            } catch (error) {
                console.error("Error fetching ranking data:", error);
                setErrorMessage("데이터를 불러오는 중 오류가 발생했습니다.");
            }
        };

        fetchRankingData();
    }, [selectedLeague, activeSportTab]);

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
                <p className="text-gray-600 text-xs mb-6">* {lastUpdate}</p>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-3 text-center font-semibold border-b border-gray-400 pb-2">
                <div>순위</div>
                <div>TEAM</div>
                <div>승점</div>
            </div>

            {/* Team Rows */}
            {errorMessage ? (
                <div className="text-center text-red-500 mt-4">{errorMessage}</div>
            ) : (
                rankingData.map((team) => (
                    <div
                        key={team.id}
                        className="grid grid-cols-3 items-center text-center py-2 border-b border-gray-400 text-sm"
                    >
                        <div>{team.ranking}</div>
                        <div className="flex items-center justify-center space-x-2">
                            {team.iconImageUrl && (
                                <img
                                    src={team.iconImageUrl}
                                    alt={`${team.teamName} 로고`}
                                    className="w-6 h-6"
                                />
                            )}
                            <span>{team.teamName}</span>
                        </div>
                        <div className="font-bold">{team.points}</div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Ranking;
