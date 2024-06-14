import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { getAllPosts } from "../services/postsService";

function MainFeaturedPost() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const postsData = await getAllPosts();
      setPosts(postsData);
    };

    fetchPosts();
  }, []);
  const post = posts[1];
  const navigate = useNavigate();
  const handleClick = (postID) => {
    navigate(`/posts/${postID}`);
  };

  return (
    <Paper
      sx={{
        position: "relative",
        backgroundColor: "grey.800",
        color: "#fff",
        mb: 4,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url("https://source.unsplash.com/random?wallpapers")`,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: "rgba(0,0,0,.3)",
        }}
      />
      <Grid container>
        <Grid item md={6}>
          <Box
            sx={{
              position: "relative",
              p: { xs: 3, md: 6 },
              pr: { md: 0 },
            }}
          >
            <Typography
              component="h3"
              variant="h4"
              color="inherit"
              gutterBottom
            >
              {post?.title}
            </Typography>
            <Typography
              variant="h6"
              color="inherit"
              sx={{
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3, // Change this number to adjust the number of lines
              }}
            >
              {post?.description}
            </Typography>
            <Link
              variant="subtitle1"
              href="#"
              sx={{ color: "#1976D2", textDecoration: "none" }}
              onClick={() => handleClick(post?.id)}
            >
              Continue Reading...
            </Link>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default MainFeaturedPost;
