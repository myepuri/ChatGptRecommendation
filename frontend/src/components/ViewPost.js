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
  Container,
  Paper,
  Grid,
  IconButton,
  Switch,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  deletePost,
  generateComment,
  getPost,
  updatePost,
} from "../services/postsService";

const ViewPost = () => {
  const { postID } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [aiReplyEnabled, setAiReplyEnabled] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const postData = await getPost(postID);
      setPost(postData);
    };

    fetchPost();
  }, [postID]);

  const handleAddComment = async () => {
    if (comment.trim()) {
      const updatedComments = [
        ...post.comments,
        {
          text: comment,
          createdBy: currentUser.firstName,
          createdAt: new Date(),
        },
      ];
      setComments(updatedComments);
      const updatedPost = { ...post, comments: updatedComments };

      const updatedResPost = await updatePost(updatedPost);
      console.log(updatedResPost);
      setPost(updatedResPost);

      setComment("");
    }
  };

  const handleDeletePost = async () => {
    const toDelete = window.confirm("Are you sure to delete this post ?");
    if (!toDelete) return;
    await deletePost(postID);
    navigate("/");
  };

  const handleToggleAIReply = async (event) => {
    setAiReplyEnabled(event.target.checked);

    if (event.target.checked) {
      setComment("Generating...");
      try {
        const reply = await generateComment(postID);
        setComment("");
        for (let i = 0; i < reply.length; i++) {
          setComment((prevComment) => prevComment + reply[i]);
          await new Promise((resolve) => setTimeout(resolve, 10)); // Adjust typing speed as needed
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setComment("");
    }
    setAiReplyEnabled(false);
  };

  if (!post) {
    return <div>No Post</div>;
  }

  return (
    <Container maxWidth="lg">
      <Paper sx={{ mt: 4, p: 3, border: "1px solid #e0e0e0" }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" gutterBottom>
              {post.title}
            </Typography>
          </Grid>
          {currentUser?.role === "moderator" && (
            <Grid item>
              <IconButton onClick={() => handleDeletePost()}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          )}
        </Grid>
        <Typography variant="subtitle1" gutterBottom>
          By {post.createdBy}
        </Typography>
        <Typography paragraph>{post.description}</Typography>
        {currentUser && (
          <>
            <TextField
              label="Comment"
              multiline
              rows={6}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Button
                  variant="contained"
                  onClick={handleAddComment}
                  sx={{ height: "100%" }} // Adjust height to match TextField if necessary
                >
                  Add Comment
                </Button>
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      checked={aiReplyEnabled}
                      onChange={handleToggleAIReply}
                      name="aiReplyEnabled"
                    />
                  }
                  label="Generate AI Reply"
                />
              </Grid>
            </Grid>
          </>
        )}

        <h3 style={{ marginTop: "20px" }}>Comments</h3>
        <List>
          {post?.comments.map((c, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={c.text}
                secondary={`Commented by ${c.createdBy}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default ViewPost;
