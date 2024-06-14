import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ManageProfile = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from localStorage and parse them to JSON
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    // Exclude password from user details
    const usersWithoutPassword = storedUsers.map(
      ({ password, ...rest }) => rest
    );
    setUsers(usersWithoutPassword);
  }, []);

  return (
    <Container>
      <Box my={4}>
        <Grid container spacing={4}>
          {users.map((user, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{`${user.firstName} ${user.lastName}`}</Typography>
                  <Typography color="textSecondary">{user.email}</Typography>
                  <IconButton
                    aria-label="settings"
                    onClick={() => {
                      // Placeholder for click action
                    }}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ManageProfiles;
