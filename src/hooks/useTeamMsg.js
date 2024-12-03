import {useEffect, useState} from "react";
import {useRecoilValue} from "recoil";
import {teamIdState} from "../state/sportTabState";
import axiosInstance from "../utils/axiosInstance";

export default function useTeamMsg() {
    const teamId = useRecoilValue(teamIdState); // Recoil에서 teamId 가져오기
    const [messages, setMessages] = useState([]); // 댓글 목록
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    const fetchMessages = async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log(teamId);
            const response = await axiosInstance.get(`/message/${teamId}`);
            const data = response.data;

            setMessages(data); // 가져온 데이터를 상태에 저장
        } catch (err) {
            setError(err.message || "Failed to fetch messages");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (teamId) {
            fetchMessages();
        }
    }, [teamId]); // teamId가 변경될 때마다 실행

    return {messages, isLoading, error, setMessages, fetchMessages};
}
