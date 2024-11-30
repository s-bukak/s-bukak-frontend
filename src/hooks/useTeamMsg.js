import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { teamIdState } from "../state/sportTabState";
import { DOMAIN_NAME, TOKEN_NAME } from "../App";

export default function useTeamMsg() {
  const teamId = useRecoilValue(teamIdState); // Recoil에서 teamId 가져오기
  const [messages, setMessages] = useState([]); // 댓글 목록
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!TOKEN_NAME) {
        console.error("Authorization token is missing. Check your .env file.");
        return;
      }

      const response = await fetch(`${DOMAIN_NAME}/message/${teamId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN_NAME}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }
      const data = await response.json();

      setMessages(data); // 가져온 데이터를 상태에 저장
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [teamId]); // teamId가 변경될 때마다 실행

  return { messages, isLoading, error, setMessages, fetchMessages };
}
