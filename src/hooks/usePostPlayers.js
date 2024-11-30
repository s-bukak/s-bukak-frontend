import { useState } from "react";
import { DOMAIN_NAME, TOKEN_NAME } from "../App";

export default function usePostPlayers() {
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  const postPlayers = async (teamId, players) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${DOMAIN_NAME}/team/${teamId}/players`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN_NAME}`,
        },
        body: JSON.stringify({ players }),
      });

      if (!response.ok) {
        console.error("HTTP 요청 실패:", response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
