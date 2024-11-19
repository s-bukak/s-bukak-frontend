import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import StatusIndicator from "../../components/StateIndecator";
import { DOMAIN_NAME, TOKEN_NAME } from "../../App";
import { activeSportTabState } from "../../state/sportTabState";

function Betting() {
    const [bettingData, setBettingData] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const activeSportTab = useRecoilValue(activeSportTabState); // 'soccer' 또는 'basketball'

    useEffect(() => {
        const fetchBettingData = async () => {
            try {
                const response = await axios.get(`${DOMAIN_NAME}/schedule`, {
                    headers: {
                        Authorization: `Bearer ${TOKEN_NAME}`,
                    },
                });

                // Flattening the schedulesYear structure into a single array of games
                const games = response.data.schedulesYear.flatMap((year) =>
                    year.schedulesMonth.flatMap((month) =>
                        month.schedules.map((schedule) => ({
                            sportType: schedule.sportType,
                            startDate: schedule.startDate,
                            betType: schedule.betType,
                            betTimeType: schedule.betTimeType,
                            homeTeamName: schedule.homeTeamName,
                            homeTeamIconImageUrl: schedule.homeTeamIconImageUrl,
                            homeTeamScore: schedule.homeTeamGoals,
                            homeTeamPrediction:
                                schedule.homeTeamBetPercentage !== null
                                    ? `${schedule.homeTeamBetPercentage}%`
                                    : "-%",
                            awayTeamName: schedule.awayTeamName,
                            awayTeamIconImageUrl: schedule.awayTeamIconImageUrl,
                            awayTeamScore: schedule.awayTeamGoals,
                            awayTeamPrediction:
                                schedule.awayTeamBetPercentage !== null
                                    ? `${schedule.awayTeamBetPercentage}%`
                                    : "-%",
                        }))
                    )
                );

                setBettingData(games);
                setErrorMessage(null);
            } catch (error) {
                console.error("Error fetching betting data:", error);
                setErrorMessage("데이터를 불러오는 중 오류가 발생했습니다.");
            }
        };

        fetchBettingData();
    }, []);

    // sportType에 따라 데이터 필터링
    const filteredData = bettingData.filter((game) =>
        activeSportTab === "soccer"
            ? game.sportType === "축구"
            : game.sportType === "농구"
    );

    return (
        <div>
            {errorMessage ? (
                <div className="text-center text-red-500 mt-4">{errorMessage}</div>
            ) : (
                filteredData.map((game, index) => (
                    <div key={index} className="mb-6">
                        <div className="flex flex-row mb-4 items-center justify-start">
                            <div className="text-xl font-bold mr-4">
                                {game.startDate}
                            </div>
                            <StatusIndicator status={game.betType}/>
                        </div>

                        <div
                            className="bg-gradient-to-b from-gray-600 to-gray-800 text-white rounded-xl shadow-md p-4 flex items-center relative">
                            {/* Home Team */}
                            <div className="flex items-center space-x-4 w-1/2 justify-start">
                                <img
                                    src={game.homeTeamIconImageUrl}
                                    alt={game.homeTeamName}
                                    className="w-20 h-20"
                                />
                                <div className="flex flex-col items-start">
                                    <p className="text-sm text-gray-300">{game.homeTeamDepartment}</p>
                                    <p className="font-semibold">{game.homeTeamName}</p>
                                    <p className="font-bold text-xl">{game.homeTeamPrediction}</p>
                                </div>
                            </div>

                            {/* Divider Line Left */}
                            <div
                                className="mx-4 h-[50%] border-r border-gray-800"
                                style={{
                                    minHeight: "70px", // 최소 높이 설정
                                }}
                            ></div>

                            {/* Score or VS */}
                            <div
                                className="text-xl font-bold text-center w-[250px]"
                            >
                                {game.betTimeType === "예측종료"
                                    ? `${game.homeTeamScore} - ${game.awayTeamScore}`
                                    : "VS"}
                            </div>

                            {/* Divider Line Right */}
                            <div
                                className="mx-4 h-[50%] border-l border-gray-800"
                                style={{
                                    minHeight: "70px", // 최소 높이 설정
                                }}
                            ></div>

                            {/* Away Team */}
                            <div className="flex items-center space-x-4 w-1/2 justify-end">
                                <div className="flex flex-col items-end">
                                    <p className="text-sm text-gray-300">{game.awayTeamDepartment}</p>
                                    <p className="font-semibold">{game.awayTeamName}</p>
                                    <p className="font-bold text-xl">{game.awayTeamPrediction}</p>
                                </div>
                                <img
                                    src={game.awayTeamIconImageUrl}
                                    alt={game.awayTeamName}
                                    className="w-20 h-20"
                                />
                            </div>
                        </div>

                    </div>
                ))
            )}
        </div>
    );
}

export default Betting;
