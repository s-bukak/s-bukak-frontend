import React, {useEffect, useState} from "react";
import {useRecoilValue} from "recoil";
import axiosInstance from "../../utils/axiosInstance"; // Axios 인스턴스
import {isTokenValid} from "../../utils/token"; // 토큰 유효성 검사
import StatusIndicator from "../../components/StateIndecator";
import {activeSportTabState} from "../../state/sportTabState";

function Betting() {
    const [bettingData, setBettingData] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [selectedBet, setSelectedBet] = useState(null); // 선택된 베팅 상태
    const activeSportTab = useRecoilValue(activeSportTabState); // 'soccer' 또는 'basketball'

    // 로그인 상태 확인
    const isLoggedIn = isTokenValid();

    // 데이터 요청
    // 데이터 요청
    useEffect(() => {
        const fetchBettingData = async () => {
            const sportType = activeSportTab === "soccer" ? "SOCCER" : "BASKETBALL";

            try {
                const response = await axiosInstance.get(`/schedule?sportType=${sportType}`);
                const games = response.data.schedulesYear.flatMap((year) =>
                    year.schedulesMonth.flatMap((month) =>
                        month.schedules.map((schedule) => ({
                            scheduleId: schedule.scheduleId,
                            sportType: schedule.sportType,
                            startDate: schedule.startDate,
                            startAt: schedule.startAt,
                            betType: schedule.betType,
                            betTimeType: schedule.betTimeType,
                            homeCollegeName: schedule.homeCollegeName,
                            homeTeamName: schedule.homeTeamName,
                            homeTeamIconImageUrl: schedule.homeTeamIconImageUrl,
                            homeTeamScore: schedule.homeTeamGoals,
                            homeTeamPrediction:
                                schedule.homeTeamBetPercentage !== null
                                    ? `${schedule.homeTeamBetPercentage}%`
                                    : "-%",
                            awayCollegeName: schedule.awayCollegeName,
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
    }, [activeSportTab, isLoggedIn, selectedBet]);

    // 현재 시간과 비교하여 과거 및 미래 경기 필터링
    const now = new Date();
    const filteredData = bettingData.filter((game) =>
        activeSportTab === "soccer"
            ? game.sportType === "축구"
            : game.sportType === "농구"
    );
    const sortedData = filteredData.sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
    const limitedData = (() => {
        const pastGames = [];
        const futureGames = [];

        for (const game of sortedData) {
            const gameTime = new Date(game.startAt);
            if (gameTime < now) pastGames.push(game);
            else futureGames.push(game);
        }

        return [...pastGames.slice(-2), ...futureGames.slice(0, 4)];
    })();

    // 베팅 처리
    const handleTeamClick = async (scheduleId, isBetHomeTeam) => {
        try {
            await axiosInstance.post("/bet", {scheduleId, isBetHomeTeam});
            setSelectedBet({scheduleId, isBetHomeTeam}); // 선택 상태 갱신
        } catch (error) {
            console.error("Betting error:", error);
            setErrorMessage("베팅 중 오류가 발생했습니다.");
        }
    };

    // 경기 점수 또는 VS 렌더링
    const renderScoreOrVs = (game) => {
        return game.betTimeType === "예측종료"
            ? `${game.homeTeamScore} - ${game.awayTeamScore}`
            : "VS";
    };

    // 예측 확률 렌더링
    const renderPrediction = (game, isHome) => {
        if (game.betTimeType === "예측예정") return "-%";
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
                                        <p className="text-xs">{game.homeCollegeName}</p>
                                        <p className="font-semibold">{game.homeTeamName}</p>
                                        <p className="font-bold text-xl">{renderPrediction(game, true)}</p>
                                    </div>
                                </div>

                                <div
                                    className="mx-4 h-[50%] border-r border-gray-800"
                                    style={{minHeight: "70px"}}
                                ></div>

                                <div className="text-xl font-bold text-center w-[250px]">
                                    {renderScoreOrVs(game)}
                                </div>

                                <div
                                    className="mx-4 h-[50%] border-l border-gray-800"
                                    style={{minHeight: "70px"}}
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
                                        <p className="text-xs">{game.awayCollegeName}</p>
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