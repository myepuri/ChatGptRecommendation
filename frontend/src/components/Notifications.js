import { useState, useEffect } from "react";
import { useNotifications } from "../contexts/NotificationContext";
import { Toolbar } from "@mui/material";

function Notifications() {
  const { notifications } = useNotifications();

  const sortedNotifications = notifications.sort(
    (a, b) => b.createdAt - a.createdAt
  );

  return (
    <Toolbar
      className="notifications"
      sx={{
        ml: "24px",
        height: "80vh",
        flexDirection: "column",
        alignItems: "flex-start",
        overflow: "auto",
      }}
    >
      <h2>Notifications</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {sortedNotifications.map((notification, index) => (
          <div
            key={index}
            style={{
              marginBottom: "15px",
              padding: "1rem",
              backgroundColor: "#ffe5b4",
            }}
          >
            New Post in <strong>{notification.topic}</strong> with title{" "}
            <strong>{notification.title}</strong>
          </div>
        ))}
      </div>
    </Toolbar>
  );
}

export default Notifications;
