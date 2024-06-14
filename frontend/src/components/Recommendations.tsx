import React, { useState } from "react";
import {
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
} from "@mui/material";

function RecommendationActivity() {
  const [activity, setActivity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Get IP address from ipapi.co
          const ipResponse = await fetch("https://ipapi.co/json/");
          const ipData = await ipResponse.json();

          // Your API call to the backend
          const backendUrl = "/api/search-activities";
          const searchResponse = await fetch(backendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              activity,
              latitude,
              longitude,
              ipAddress: ipData.ip,
            }),
          });

          const searchData = await searchResponse.json();
          console.log(searchData);

          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      },
      () => {
        alert("Unable to retrieve your location");
        setLoading(false);
      }
    );
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ mt: 4, p: 3, border: "1px solid #e0e0e0" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Search for Recommendations
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Search for an activity"
              variant="outlined"
              value={activity}
              fullWidth
              onChange={(e) => setActivity(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
              fullWidth
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default RecommendationActivity;
