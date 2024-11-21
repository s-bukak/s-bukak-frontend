import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { activeSportTabState } from "../state/sportTabState";
import { DOMAIN_NAME, TOKEN_NAME } from "../App";

export default function useTeamInfo(teamId, isModified = false) {
  const [teamInfo, setTeamInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const activeSportTab = useRecoilValue(activeSportTabState); // Recoil 상태 가져오기

  const clearCache = () => {
    if (teamId && activeSportTab) {
      localStorage.removeItem(`teamInfo-${teamId}-${activeSportTab}`);
      console.log(`Cache cleared for team ${teamId} and tab ${activeSportTab}`);
    }
  };

  useEffect(() => {
    if (!teamId || !activeSportTab) return;

    const fetchTeamInfo = async () => {
      setIsLoading(true);
      try {
        if (!TOKEN_NAME) {
          console.error(
            "Authorization token is missing. Check your .env file.",
          );
          return;
        }

        const response = await fetch(`${DOMAIN_NAME}/team/${teamId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN_NAME}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

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
      console.log("Loaded data from cache");
      setTeamInfo(JSON.parse(cachedData));
      clearCache();
    } else {
      console.log("Fetching fresh data");
      if (isModified) {
        clearCache(); // 캐시 무효화 필요 시 제거
      }
      fetchTeamInfo();
    }
  }, [teamId, activeSportTab, isModified]);

  return { teamInfo, isLoading, clearCache };
}
