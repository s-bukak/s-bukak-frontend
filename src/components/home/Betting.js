import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import StatusIndicator from "../../components/StateIndecator";
import { DOMAIN_NAME, TOKEN_NAME } from "../../App";
import { activeSportTabState } from "../../state/sportTabState";
import { jwtDecode } from "jwt-decode";

function Betting() {
    const [bettingData, setBettingData] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [selectedBet, setSelectedBet] = useState(null); // 선택된 베팅을 추적
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
    const activeSportTab = useRecoilValue(activeSportTabState); // 'soccer' 또는 'basketball'

    useEffect(() => {
        // 로그인 상태 확인
        const token = localStorage.getItem("access_token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded && decoded.exp * 1000 > Date.now()) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("JWT 디코딩 오류:", error);
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    useEffect(() => {
        const fetchBettingData = async () => {
            try {
                const response = await axios.get(`${DOMAIN_NAME}/schedule`, {
                    headers: {
                        Authorization: `Bearer ${TOKEN_NAME}`,
                    },
                });

                const games = response.data.schedulesYear.flatMap((year) =>
                    year.schedulesMonth.flatMap((month) =>
                        month.schedules.map((schedule) => ({
                            scheduleId: schedule.scheduleId,
                            sportType: schedule.sportType,
                            startDate: schedule.startDate,
                            startAt: schedule.startAt,
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
                            isBetHomeTeam: schedule.isBetHomeTeam,
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
    }, [selectedBet]);

    const now = new Date();

    const sportFilteredData = bettingData.filter((game) =>
        activeSportTab === "soccer"
            ? game.sportType === "축구"
            : game.sportType === "농구"
    );

    const sortedData = sportFilteredData.sort(
        (a, b) => new Date(a.startAt) - new Date(b.startAt)
    );

    const limitedData = (() => {
        const pastGames = [];
        const futureGames = [];

        for (const game of sortedData) {
            const gameTime = new Date(game.startAt);

            if (gameTime < now) {
                pastGames.push(game);
            } else {
                futureGames.push(game);
            }
        }

        const pastGamesToShow = pastGames.slice(-2);
        const futureGamesToShow = futureGames.slice(0, 4);

        return [...pastGamesToShow, ...futureGamesToShow];
    })();

    const handleTeamClick = async (scheduleId, isBetHomeTeam, game) => {
        try {
            if (!isLoggedIn || (game.homeTeamBetPercentage && game.awayTeamBetPercentage)) {
                return;
            }

            await axios.post(
                `${DOMAIN_NAME}/bet`,
                { scheduleId, isBetHomeTeam },
                {
                    headers: {
                        Authorization: `Bearer ${TOKEN_NAME}`,
                    },
                }
            );

            console.log("선택한 경기 : " + scheduleId + ", 선택한 팀 (1: 홈팀, 0: 어웨이 팀) : " + isBetHomeTeam);

            setSelectedBet({ scheduleId, isBetHomeTeam });
        } catch (error) {
            console.error("Betting error:", error);
            setErrorMessage("베팅 중 오류가 발생했습니다.");
        }
    };

    const renderScoreOrVs = (game) => {
        if (game.betTimeType === "예측종료") {
            return `${game.homeTeamScore} - ${game.awayTeamScore}`;
        }
        return "VS";
    };

    const renderPrediction = (game, isHome) => {
        if (game.betTimeType === "예측예정") {
            return "-%";
        }
        return isHome ? game.homeTeamPrediction : game.awayTeamPrediction;
    };

    return (
        <div className="relative">
            <div className={`relative z-0 ${!isLoggedIn ? "opacity-30 pointer-events-none" : ""}`}>
                {errorMessage ? (
                    <div className="text-center text-red-500 mt-4">{errorMessage}</div>
                ) : (
                    limitedData.map((game, index) => (
                        <div key={index} className="mb-6">
                            <div className="flex flex-row mb-4 items-center justify-start">
                                <div className="text-xl font-bold mr-4">
                                    {game.startDate}
                                </div>
                                <StatusIndicator
                                    status={
                                        game.betTimeType === "예측종료"
                                            ? game.betType
                                            : game.betTimeType
                                    }
                                />
                            </div>

                            <div
                                className="bg-gradient-to-b from-gray-600 to-gray-800 text-white rounded-xl shadow-md p-4 flex items-center relative"
                            >
                                <div
                                    className={`flex items-center space-x-4 w-1/2 justify-start transform transition-transform duration-200 ${
                                        game.isBetHomeTeam === true ? "text-transparent bg-clip-text bg-gradient-to-b from-sky-200 to-lime-200" : ""
                                    } ${
                                        (game.betTimeType === "예측종료" ||
                                            game.betTimeType === "예측예정" ||
                                            game.betType === "참여완료")
                                            ? "cursor-not-allowed pointer-events-none"
                                            : "cursor-pointer hover:scale-105"
                                    }`}
                                    onClick={
                                        game.betTimeType === "예측종료" ||
                                        game.betTimeType === "예측예정" ||
                                        game.betType === "참여완료"
                                            ? undefined
                                            : () => handleTeamClick(game.scheduleId, true, game)
                                    }
                                >
                                    <img
                                        src={game.homeTeamIconImageUrl}
                                        alt={game.homeTeamName}
                                        className="w-12 h-12"
                                    />
                                    <div className="flex flex-col items-start">
                                        <p className="font-semibold">{game.homeTeamName}</p>
                                        <p className="font-bold text-xl">{renderPrediction(game, true)}</p>
                                    </div>
                                </div>

                                <div
                                    className="mx-4 h-[50%] border-r border-gray-800"
                                    style={{ minHeight: "70px" }}
                                ></div>

                                <div className="text-xl font-bold text-center w-[250px]">
                                    {renderScoreOrVs(game)}
                                </div>

                                <div
                                    className="mx-4 h-[50%] border-l border-gray-800"
                                    style={{ minHeight: "70px" }}
                                ></div>

                                <div
                                    className={`flex items-center space-x-4 w-1/2 justify-end transform transition-transform duration-200 ${
                                        game.isBetHomeTeam === false ? "text-transparent bg-clip-text bg-gradient-to-b from-sky-200 to-lime-200" : ""
                                    } ${
                                        (game.betTimeType === "예측종료" ||
                                            game.betTimeType === "예측예정" ||
                                            game.betType === "참여완료")
                                            ? "cursor-not-allowed pointer-events-none"
                                            : "cursor-pointer hover:scale-105"
                                    }`}
                                    onClick={
                                        game.betTimeType === "예측종료" ||
                                        game.betTimeType === "예측예정" ||
                                        game.betType === "참여완료"
                                            ? undefined
                                            : () => handleTeamClick(game.scheduleId, false, game)
                                    }
                                >
                                    <div className="flex flex-col items-end">
                                        <p className="font-semibold">{game.awayTeamName}</p>
                                        <p className="font-bold text-xl">{renderPrediction(game, false)}</p>
                                    </div>
                                    <img
                                        src={game.awayTeamIconImageUrl}
                                        alt={game.awayTeamName}
                                        className="w-12 h-12"
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {!isLoggedIn && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="relative z-20 bg-none mb-72 text-gray-800 font-bold text-lg">
                        로그인 후 이용 가능한 서비스입니다.
                    </div>
                </div>
            )}
        </div>
    );
}

export default Betting;
