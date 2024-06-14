import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "../src/contexts/AuthContext.js";
import Blog from "./components//Blog.js";
import SignIn from "./components//SignIn.js";
import SignUp from "./components//SignUp.js";
import { initializeUsersDatabase, updateDB } from "./utils/initializeUserDB.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import "./App.css";
import ManageProfile from "./components/ManageProfiles.js";
import CreatePost from "./components/CreatePost.js";
import ViewPost from "./components/ViewPost.js";
import Topics from "./components/Topics.js";
import Notifications from "./components/Notifications.js";
import RecommendationActivity from "./components/Recommendations.js";
import { NotificationsProvider } from "./contexts/NotificationContext.js";
import { SocketProvider } from "./contexts/SocketContext.js";
import Header from "./components/Header.js";
import { Container } from "@mui/material";
import { useSubscribeToTopics } from "./utils/Subscription.js";
import Mapview from "./components/Mapview.js";

initializeUsersDatabase();

function AppLayout() {
  const topicsToSubscribe = JSON.parse(localStorage.getItem("topics"));
  useSubscribeToTopics(topicsToSubscribe);
  return (
    <Container maxWidth="lg">
      <Header />
      <main>
        <Outlet />
      </main>
    </Container>
  );
}

function App() {
  return (
    <>
      <AuthProvider>
        <SocketProvider>
          <NotificationsProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route path="/signin" element={<SignIn />}></Route>
                  <Route path="/signup" element={<SignUp />}></Route>
                  <Route path="/" element={<Blog />}></Route>
                  <Route
                    path="create-post"
                    element={
                      <ProtectedRoute>
                        <CreatePost />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/manage-profiles"
                    element={
                      <ProtectedRoute requiredRole="administrator">
                        <ManageProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/posts/:postID" element={<ViewPost />} />
                  <Route path="/topics/:topicName" element={<Topics />} />
                  <Route
                    path="/recommendations"
                    element={<RecommendationActivity />}
                  />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/recommended-for-you" element={<Mapview />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </NotificationsProvider>
        </SocketProvider>
      </AuthProvider>
    </>
  );
}

export default App;
