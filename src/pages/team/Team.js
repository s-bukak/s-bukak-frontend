import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { teamIdState } from "../../state/sportTabState";

import RecentMatches from "../../components/team/RecentMatch";
import Formation from "../../components/team/Formation";
import TeamSchedule from "../../components/team/TeamSchedule";
import Cheering from "../../components/team/Cheering";

import useTeamInfo from "../../hooks/useTeamInfo";

const Team = () => {
  const { teamId } = useParams();
  const [_, setTeamId] = useRecoilState(teamIdState);

  useEffect(() => {
    if (teamId) {
      setTeamId(Number(teamId));
    }
  }, [teamId, setTeamId]);

  const [isModified, setIsModified] = useState(false);
  const { teamInfo, isLoading } = useTeamInfo(teamId, isModified);

  if (!teamInfo) {
    return <div>팀 정보가 없습니다...</div>;
  }
  if (isLoading) {
    return <p>팀 정보 불러오는 중...</p>;
  }

  return (
    <div className=" w-full container mx-auto p-4 my-20">
      <div className="flex items-center space-x-4 mb-14 justify-between max-w-[67rem] mx-auto">
        <div className="flex items-center justify-center">
          <img
            src={teamInfo.logoUrl}
            alt={teamInfo.name}
            className="w-24 h-auto mr-3"
          />
          <div>
            <h1 className="text-4xl font-bold mb-3">{teamInfo.name}</h1>
            <h3 className="text-xl font-medium">{teamInfo.collageName} 소속</h3>
          </div>
        </div>

        <div className="bg-gray-500 p-4 px-7 rounded-md text-center text-white">
          <div className="text-2x">
            {teamInfo.teamRank.year} {teamInfo.teamRank.category}
          </div>
          <div className="text-3xl font-bold">{teamInfo.teamRank.rank}위</div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row lg:space-x-11 justify-center">
        <div className="space-y-6 rounded-lg bg-gray-100 p-8">
          <div className="flex space-x-6 justify-center">
            <RecentMatches
              owner={teamInfo}
              recentMatches={teamInfo.recentMatches}
            />
            <Formation owner={teamInfo} />
          </div>
          <TeamSchedule owner={teamInfo} schedules={teamInfo.upcomingMatches} />
        </div>
        <div className="lg:w-1/3">
          <Cheering owner={teamInfo} />
        </div>
      </div>
    </div>
  );
};

export default Team;
