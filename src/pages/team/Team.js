import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { activeSportTabState } from "../../state/sportTabState";
import { getTeamInfo } from "./TeamData";

// 분리된 컴포넌트들
import RecentMatches from "../../components/team/RecentMatch";
import Formation from "../../components/team/Formation";
import TeamSchedule from "../../components/team/TeamSchedule";
import Cheering from "../../components/team/Cheering";

const Team = () => {
  const { teamName } = useParams(); // URL에서 팀 이름 가져오기
  const activeSportTab = useRecoilValue(activeSportTabState); // 현재 스포츠 탭 (축구/농구) 상태 가져오기
  const [teamInfo, setTeamInfo] = useState(null);

  useEffect(() => {
    // 팀 정보를 가져오는 로직 (getTeamInfo 함수는 가상으로 구현해둔 상태입니다)
    const fetchTeamInfo = async () => {
      const info = await getTeamInfo(activeSportTab, teamName);
      setTeamInfo(info);
    };
    fetchTeamInfo();
  }, [activeSportTab, teamName]);

  if (!teamInfo) {
    return <div>팀 정보를 불러오는 중...</div>;
  }

  return (
    <div className="container mx-auto p-4 my-20">
      <div className="flex items-center space-x-4 mx-52 mb-14 justify-between">
        <div className="flex items-center justify-center">
          <img
            src={teamInfo.logoUrl}
            alt={teamName}
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
      {/* 좌우 레이아웃 설정 */}
      <div className="flex flex-col lg:flex-row lg:space-x-11 justify-center">
        {/* 왼쪽 (최근 경기 전적, 포메이션, 경기 일정) */}
        <div className="space-y-6 rounded-lg bg-gray-100 p-8">
          <div className="flex space-x-6 justify-center">
            {/* 최근 경기 전적 컴포넌트 */}
            <RecentMatches
              owner={teamInfo}
              recentMatches={teamInfo.recentMatches}
            />
            {/* 포메이션 컴포넌트 */}
            <Formation />
          </div>

          {/* 경기 일정 컴포넌트 */}
          <TeamSchedule owner={teamInfo} schedules={teamInfo.upcomingMatches} />
        </div>
        {/* 오른쪽 (응원 메시지 댓글창) */}
        <div className="lg:w-1/3">
          {/* 응원 메시지 남기는 댓글창 컴포넌트 */}
          <Cheering teamInfo={teamInfo} />
        </div>
      </div>
    </div>
  );
};

export default Team;
