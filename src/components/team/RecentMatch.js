import React from "react";
import { useRecoilValue } from "recoil";
import { activeSportTabState } from "../../state/sportTabState";
import { getTeamLogoPath } from "../../utils/LogoUtils"; // 경로에 맞게 수정

const RecentMatch = ({ owner, recentMatches }) => {
  const activeSportTab = useRecoilValue(activeSportTabState);
  const leagueSCBg = ["bg-green-500", "bg-sky-600", "bg-red-400"];
  const leagueBBBg = ["bg-emerald-800", "bg-sky-700", "bg-yellow-700"];

  return (
    <div className="mb-0">
      <h2 className="text-xl font-bold">최근 경기 전적</h2>
      <div className="mt-4">
        {recentMatches.map((match, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-center bg-white py-3 px-16 rounded-lg shadow-sm">
              <div className="flex flex-col items-center text-center">
                <img
                  src={owner.logoUrl}
                  alt={owner.name}
                  className="m-1 w-7 h-7 object-cover"
                />
                <span className="font-medium text-sm text-center">
                  {owner.name}
                </span>{" "}
                {/* mt-1로 간격 조절 */}
              </div>
              <span className="text-3xl font-medium text-blue-900 mx-6">
                {match.score}
              </span>
              <div className="flex flex-col items-center text-center">
                <img
                  src={match.opponentLogoUrl}
                  alt={match.opponent}
                  className="m-1 w-7 h-7 object-cover"
                />
                <span className="font-medium text-sm text-center">
                  {match.opponent}
                </span>{" "}
                {/* mt-1로 간격 조절 */}
              </div>
            </div>
            <div
              className={`p-2 text-sm text-center rounded-b-lg text-white ${activeSportTab == "soccer" ? leagueSCBg[index] : leagueBBBg[index]}`}
            >
              {match.league} {match.round} ROUND
              <div>{match.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentMatch;
