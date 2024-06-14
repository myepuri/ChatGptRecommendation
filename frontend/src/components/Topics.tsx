import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  TextField,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { deletePost, getAllPosts } from "../services/postsService";
import { useSocket } from "../contexts/SocketContext";

const Topics = () => {
  const { topicName } = useParams();
  const [posts, setPosts] = useState([]);
  const [originalPosts, setOriginalPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { socket } = useSocket();

  useEffect(() => {
    const fetchPosts = async () => {
      const postsData = await getAllPosts();
      const filteredPosts = postsData.filter(
        (post) => post.topic === topicName
      );
      setPosts(filteredPosts);
      setOriginalPosts(filteredPosts);
    };

    fetchPosts();
  }, [topicName]);

  useEffect(() => {
    if (!searchQuery) {
      setPosts(originalPosts);
    }
  }, [searchQuery]);

  const handleSubscribe = () => {
    const userEmail = currentUser?.email;
    console.log(userEmail);
    socket.emit("subscribe", { userEmail, topicName });
    alert(`Subscribed to topicName: ${topicName}`);
  };

  const handleUnsubscribe = () => {
    const userEmail = currentUser?.email;
    socket.emit("unsubscribe", { userEmail, topicName });
    alert(`Unsubscribed from topicName: ${topicName}`);
  };

  const handleDelete = async (event, postId) => {
    event.stopPropagation();
    const deleteConfirm = window.confirm("Are you sure to delete ?");
    if (!deleteConfirm) return;
    await deletePost(postId);
    const updatedFilteredPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedFilteredPosts);
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      setPosts(originalPosts);
      return;
    }
    const filteredPosts = originalPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setPosts(filteredPosts);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 4 }}>
        Posts on {topicName}
      </Typography>
      <button onClick={handleSubscribe}>Subscribe</button>
      <button onClick={handleUnsubscribe}>Unsubscribe</button>
      {/* Search Bar */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={10}>
          <TextField
            fullWidth
            label="Search Posts"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSearch}
            style={{ height: "100%" }}
          >
            Search
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {posts.map((post) => (
          <Grid item key={post.id} xs={12} sm={6} md={4}>
            <Card
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              <CardContent>
                <Typography variant="h5" component="div">
                  {post.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {post.description}
                </Typography>
                <Typography variant="subtitle1" color="primary">
                  Continue reading...
                </Typography>
                {currentUser?.role === "moderator" && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={(event) => handleDelete(event, post.id)}
                  >
                    Delete
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Topics;
