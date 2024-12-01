import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function usePostPlayers() {
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  const postPlayers = async (teamId, players) => {
    setIsLoading(true);
    setError(null);

    try {
      await axiosInstance.post(`/team/${teamId}/players`, { players });
      // 데이터가 필요 없으면 여기서 함수 종료
    } catch (err) {
      console.error("POST 요청 실패:", err);
      setError(err.message || "알 수 없는 오류가 발생했습니다.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { postPlayers, isLoading, error }; // 훅에서 상태와 함수 반환
}
