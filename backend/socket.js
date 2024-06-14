const { Server } = require("socket.io");
let io;

const subscribers = {};

const init = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(socket.id, "- Connected");

    socket.on("subscribe", ({ userEmail, topicName }) => {
      console.log(userEmail);
      if (!subscribers[topicName]) {
        subscribers[topicName] = new Set();
      }
      const subscriberKey = userEmail + ":" + socket.id;
      subscribers[topicName].add(subscriberKey);
      console.log(`User ${userEmail} subscribed to topicName ${topicName}`);
      console.log(subscribers);
    });

    socket.on("unsubscribe", ({ userEmail, topicName }) => {
      if (subscribers[topicName]) {
        const subscriberKeyToRemove = userEmail + ":" + socket.id;
        subscribers[topicName].delete(subscriberKeyToRemove);
        console.log(
          `User ${userEmail} unsubscribed from topicName ${topicName}`
        );
      }
    });

    socket.on("disconnect", () => {
      Object.keys(subscribers).forEach((topicName) => {
        const newSet = new Set();
        subscribers[topicName].forEach((subscriber) => {
          const [, socketID] = subscriber.split(":");
          if (socketID !== socket.id) {
            newSet.add(subscriber);
          }
        });
        subscribers[topicName] = newSet;
      });
      console.log(`Socket ${socket.id} disconnected`);
    });
  });

  return io;
};

const emitToSubscribers = (topic, event, data) => {
  if (!io) throw new Error("Socket.io not initialized!");

  const topicSubscribers = subscribers[topic];
  console.log(topicSubscribers);
  if (topicSubscribers) {
    topicSubscribers.forEach((subscriber) => {
      const [userEmail, socketID] = subscriber.split(":");
      io.to(socketID).emit(event, data);
      console.log(
        `Notification sent to ${userEmail} with socket-id : ${socketID}}`
      );
    });
  }
};

module.exports = { init, emitToSubscribers };
