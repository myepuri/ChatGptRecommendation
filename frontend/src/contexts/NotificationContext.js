import { createContext, useState, useEffect, useContext } from "react";
import { useSocket } from "./SocketContext.js";

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const initialNotifications =
    JSON.parse(localStorage.getItem("notifications")) || [];
  const [notifications, setNotifications] = useState(initialNotifications);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket == null) return;
    socket.on("newPost", (post) => {
      console.log(post);
      const newNotification = {
        title: post.title,
        topic: post.topic,
        createdAt: Date.now(),
      };
      setNotifications((currentNotifications) => [
        ...currentNotifications,
        newNotification,
      ]);

      const notifications = JSON.parse(localStorage.getItem("notifications"));
      notifications.push(newNotification);

      localStorage.setItem("notifications", JSON.stringify(notifications));
    });

    return () => {
      socket.off("newPost");
    };
  }, [socket]);

  return (
    <NotificationsContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error(
      "NotificationContext was used outside NotificationProvider"
    );
  }
  return context;
}
