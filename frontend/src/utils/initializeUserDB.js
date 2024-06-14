import users from "../data/users.json";

export const initializeUsersDatabase = () => {
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify(users));
  }
  if (!localStorage.getItem("topics")) {
    localStorage.setItem("topics", JSON.stringify([]));
  }
  if (!localStorage.getItem("notifications")) {
    localStorage.setItem("notifications", JSON.stringify([]));
  }
};
