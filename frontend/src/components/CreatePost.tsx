import React, { useState } from "react";
import { Container, Box, Grid, TextField, Button } from "@mui/material";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createdBy, setCreatedBy] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPost = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      createdBy,
      comments: [],
    };

    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.push(newPost);
    localStorage.setItem("posts", JSON.stringify(posts));

    setTitle("");
    setDescription("");
    setCreatedBy("");
  };

  return (
    <Container>
      <Box my={4}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Your Name"
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" type="submit">
                Add Post
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}

export default AddPost;
