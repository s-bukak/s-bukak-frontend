import React from "react";
import StatusIndicator from "../../components/StateIndecator";
import bettingData from "../../data/betting";

function Betting() {
    return (
        <div>
            {bettingData.map((game, index) => (
                <div key={index} className="mb-6">
                    <div className="flex flex-row mb-4 items-center justify-start">
                        <div className="text-xl font-bold mr-4">
                            {game.startDate}
                        </div>
                        <StatusIndicator status={game.betType} />
                    </div>

                    <div className="bg-gradient-to-b from-gray-600 to-gray-800 text-white rounded-xl shadow-md p-4 flex justify-between items-center">
                        {/* Home Team */}
                        <div className="flex items-center space-x-4">
                            <img src={game.homeTeamIconImageUrl} alt={game.homeTeamName} className="w-10 h-10" />
                            <div className="flex flex-col items-start">
                                <p className="font-semibold">{game.homeTeamName}</p>
                                <p className="font-bold text-xl">{game.homeTeamPrediction}</p>
                            </div>
                        </div>

                        {/* Score or VS */}
                        <div className="text-xl font-bold">
                            {game.betType === "예측종료" ? `${game.homeTeamScore} - ${game.awayTeamScore}` : "VS"}
                        </div>

                        {/* Away Team */}
                        <div className="flex items-center space-x-4">
                            <div className="flex flex-col items-end">
                                <p className="font-semibold">{game.awayTeamName}</p>
                                <p className="font-bold text-xl">{game.awayTeamPrediction}</p>
                            </div>
                            <img src={game.awayTeamIconImageUrl} alt={game.awayTeamName} className="w-10 h-10" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Betting;
