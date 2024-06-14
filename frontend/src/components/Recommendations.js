import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import { getRecommendations } from "../services/postsService";
import extractActivities from "../utils/extractActivities";

function RecommendationActivity() {
  const [activity, setActivity] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [displayedRecommendations, setDisplayedRecommendations] = useState("");
  const [loading, setLoading] = useState(false);

  const typeOutRecommendations = async (text) => {
    for (let i = 0; i <= text.length; i++) {
      const toDisplay = text.substring(0, i);
      setDisplayedRecommendations(toDisplay);
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setDisplayedRecommendations("");
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async () => {
        try {
          const ipResponse = await fetch("https://ipapi.co/json/", {
            headers: { "User-Agent": "nodejs-ipapi-v1.02" },
          });
          const ipData = await ipResponse.json();
          localStorage.setItem("lat", ipData?.latitude);
          localStorage.setItem("long", ipData?.longitude);
          const activities = await getRecommendations(
            ipData?.ip,
            activity,
            ipData
          );
          const restaurants = extractActivities("Restaurants", activities);
          console.log(restaurants);
          const sports = extractActivities("Sports Events", activities);
          console.log(sports);
          const music = extractActivities("Music Concerts", activities);
          console.log(music);
          if (restaurants.length > 0) {
            localStorage.setItem("Restaurants", JSON.stringify([]));
            localStorage.setItem("Sports", JSON.stringify([]));
            localStorage.setItem("Music", JSON.stringify([]));
            localStorage.setItem("Restaurants", JSON.stringify(restaurants));
            localStorage.setItem("Sports", JSON.stringify(sports));
            localStorage.setItem("Music", JSON.stringify(music));
          }
          setRecommendations(activities);
          typeOutRecommendations(activities);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          alert("Location access denied. Please enable GPS and try again.");
        } else {
          alert(
            "Unable to retrieve your location. Please try again or check your device settings."
          );
        }
        setLoading(false);
      }
    );
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        my: 4,
      }}
    >
      <Paper sx={{ p: 3, width: "100%", flexGrow: 1 }}>
        <Typography variant="h5" gutterBottom>
          Get Recommendations Based on Your Location and Weather Conditions
        </Typography>
        <Grid container spacing={2} alignItems="center" sx={{ mt: 4 }}>
          <Grid item xs={10}>
            <TextField
              fullWidth
              label="Search for an activity ex: sports, adventure etc..."
              variant="outlined"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSearch}
              disabled={loading}
              sx={{ height: "56px" }}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </Grid>
        </Grid>
        {displayedRecommendations && (
          <Typography sx={{ mt: 4, whiteSpace: "pre-line" }}>
            Below are the recommendations:
            <br />
            {displayedRecommendations}
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

export default RecommendationActivity;
