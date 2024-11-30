import { useState } from "react";
import { DOMAIN_NAME, TOKEN_NAME } from "../App";

const useDeleteMsg = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteMessage = async (messageId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${DOMAIN_NAME}/message/${messageId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN_NAME}`,
        },
      });
      return response.data;
    } catch (err) {
      setError(err);
      console.error("Error deleting message:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteMessage, isLoading, error };
};

export default useDeleteMsg;
