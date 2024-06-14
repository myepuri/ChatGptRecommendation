import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const ViewPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Load the post data from localStorage
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const currentPost = posts.find((p) => p.postId === postId);

    if (currentPost) {
      setPost(currentPost);
      setComments(currentPost.comments || []);
    }
  }, [postId]);

  const handleAddComment = () => {
    if (comment.trim()) {
      const updatedComments = [
        ...comments,
        { text: comment, createdBy: "Current User" },
      ];
      setComments(updatedComments);

      // Update post in localStorage
      const posts = JSON.parse(localStorage.getItem("posts")) || [];
      const postIndex = posts.findIndex((p) => p.postId === postId);
      if (postIndex !== -1) {
        posts[postIndex].comments = updatedComments;
        localStorage.setItem("posts", JSON.stringify(posts));
      }

      setComment("");
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <Typography variant="h4">{post.title}</Typography>
      <Typography variant="subtitle1">By {post.createdBy}</Typography>
      <Typography paragraph>{post.description}</Typography>
      <Box component="div">
        <TextField
          label="Comment"
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          variant="outlined"
          fullWidth
        />
        <Button variant="contained" onClick={handleAddComment}>
          Add Comment
        </Button>
      </Box>
      <List>
        {comments.map((c, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={c.text}
              secondary={`Commented by ${c.createdBy}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ViewPost;
