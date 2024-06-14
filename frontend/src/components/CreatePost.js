import React, { useState } from "react";
import {
  Container,
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { addPost } from "../services/postsService";

function AddPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPost = {
      title,
      description,
      comments: [],
      createdByName: currentUser.firstName,
      createdBy: currentUser.email,
      topic,
    };

    await addPost(newPost);

    setTitle("");
    setDescription("");
    alert("Post created successfully !");
  };

  return (
    <Container>
      <Box
        my={4}
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Create New Post
        </Typography>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            width: "100%",
            maxWidth: "600px",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3} alignItems="flex-end">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  variant="outlined"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="topic-label">Topic</InputLabel>
                  <Select
                    labelId="topic-label"
                    id="topic"
                    label="topic"
                    name="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  >
                    <MenuItem value="Academic Resources">
                      Academic Resources
                    </MenuItem>
                    <MenuItem value="Career Services">Career Services</MenuItem>
                    <MenuItem value="Campus Culture">Campus Culture</MenuItem>
                    <MenuItem value="Local Community Resources">
                      Local Community Resources
                    </MenuItem>
                    <MenuItem value="Social">Social</MenuItem>
                    <MenuItem value="Sports">Sports</MenuItem>
                    <MenuItem value="Health and Wellness">
                      Health and Wellness
                    </MenuItem>
                    <MenuItem value="Technology">Technology</MenuItem>
                    <MenuItem value="Travel">Travel</MenuItem>
                    <MenuItem value="Alumni">Alumni</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={10}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} textAlign="center">
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ width: "100%" }}
                >
                  Add Post
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default AddPost;
