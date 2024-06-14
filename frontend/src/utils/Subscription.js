import { useEffect, useContext } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";

// Custom hook to subscribe to topics
export function useSubscribeToTopics(topics) {
  const { currentUser } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    if (!currentUser || !socket) return;
    const userEmail = currentUser?.email;

    topics?.forEach((topicName) => {
      socket.emit("subscribe", { userEmail, topicName });
    });

    return () => {
      topics?.forEach((topicName) => {
        socket.emit("unsubscribe", { userEmail, topicName });
      });
    };
  }, [currentUser, socket, topics]);
}
