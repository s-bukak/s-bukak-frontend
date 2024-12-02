import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const useDeleteMsg = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteMessage = async (messageId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.delete(`/message/${messageId}`);
      return response.data;
    } catch (err) {
      setError(err.message || "알 수 없는 오류가 발생했습니다.");
      console.error("Error deleting message:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteMessage, isLoading, error };
};

export default useDeleteMsg;
