// Notifications.js
import React, { useContext } from "react";
import { useNotifications } from "../contexts/NotificationContext";

function Notifications() {
  const { notifications } = useNotifications();

  return (
    <div className="notifications">
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>
            New post in {notification.topic}: {notification.name} -{" "}
            {notification.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;
