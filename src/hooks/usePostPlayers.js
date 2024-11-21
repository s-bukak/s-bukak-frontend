import { useState } from "react";
import { DOMAIN_NAME, TOKEN_NAME } from "../App";

export default function usePostPlayers() {
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  const postPlayers = async (teamId, players) => {
    setIsLoading(true); // 요청 시작
    setError(null); // 이전 에러 초기화

    try {
      const response = await fetch(`${DOMAIN_NAME}/team/${teamId}/players`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN_NAME}`,
        },
        body: JSON.stringify({ players }), // players 데이터를 JSON으로 전송
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // 서버 응답 데이터 반환
      return data;
    } catch (err) {
      console.error("POST 요청 실패:", err);
      setError(err.message || "알 수 없는 오류가 발생했습니다.");
      throw err; // 상위에서 처리하도록 에러를 다시 던짐
    } finally {
      setIsLoading(false); // 요청 종료
    }
  };

  return { postPlayers, isLoading, error }; // 훅에서 상태와 함수 반환
}