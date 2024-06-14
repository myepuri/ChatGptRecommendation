import { createContext, useState, useContext, useEffect } from "react";
import { initializeUsersDatabase } from "../utils/initializeUserDB";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  const signin = async (userData) => {
    const users = JSON.parse(localStorage.getItem("users"));
    if (!users.length) {
      alert("Authentication failed. Email or password is incorrect.");
      throw new Error("Email or password is incorrect");
    }
    const user = users.find((user) => user.email === userData.email);
    if (user && user.password === userData.password) {
      if (user.isActive === false) {
        alert("Your login is disabled. Please contact Admin to reactivate");
        throw new Error(
          "Your login is disabled. Please contact Admin to reactivate"
        );
      }
      localStorage.setItem("currentUser", JSON.stringify(user));
      setCurrentUser(user);
    } else {
      throw new Error("Email or password is incorrect");
    }
  };

  const signout = async () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const signup = async (userData) => {
    initializeUsersDatabase();
    const users = JSON.parse(localStorage.getItem("users"));
    users.push({ ...userData, isActive: true });

    localStorage.setItem("users", JSON.stringify(users));
  };

  return (
    <AuthContext.Provider value={{ currentUser, signin, signout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
