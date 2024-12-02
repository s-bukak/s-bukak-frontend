import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { activeSportTabState } from "../state/sportTabState";
import axiosInstance from "../utils/axiosInstance";

export default function useTeamInfo(teamId, isModified = false) {
  const [teamInfo, setTeamInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const activeSportTab = useRecoilValue(activeSportTabState); // Recoil 상태 가져오기

  const clearCache = () => {
    if (teamId && activeSportTab) {
      localStorage.removeItem(`teamInfo-${teamId}-${activeSportTab}`);
    }
  };

  useEffect(() => {
    if (!teamId || !activeSportTab) return;

    const fetchTeamInfo = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/team/${teamId}`);
        const data = response.data;

        setTeamInfo(data);
        localStorage.setItem(
          `teamInfo-${teamId}-${activeSportTab}`,
          JSON.stringify(data),
        );
      } catch (error) {
        console.error("Fetch error:", error.message || error);
      } finally {
        setIsLoading(false);
      }
    };

    const cachedData = localStorage.getItem(
      `teamInfo-${teamId}-${activeSportTab}`,
    );

    if (cachedData && !isModified) {
      setTeamInfo(JSON.parse(cachedData));
      clearCache();
    } else {
      if (isModified) {
        clearCache(); // 캐시 무효화 필요 시 제거
      }
      fetchTeamInfo();
    }
  }, [teamId, activeSportTab, isModified]);

  return { teamInfo, isLoading, clearCache };
}
