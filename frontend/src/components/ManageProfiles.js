import React, { useState, useEffect, useRef } from "react";
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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { useAuth } from "../contexts/AuthContext";

const ManageProfiles = () => {
  const storedUsersRef = useRef([]);
  const [users, setUsers] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuUserId, setMenuUserId] = useState(null);

  const { currentUser } = useAuth();
  const open = Boolean(anchorEl);
  const handleClick = (event, userEmail) => {
    setAnchorEl(event.currentTarget);
    setMenuUserId(userEmail);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setMenuUserId(null);
  };

  const handleLoginStatus = (selectedUser) => {
    handleClose();
    const updatedUsers = users.map((user, idx) => {
      if (selectedUser.email === user.email) {
        return { ...user, isActive: !user.isActive };
      }
      return user;
    });

    const storedUsers = storedUsersRef.current.map((user, idx) => {
      if (selectedUser.email === user.email) {
        return { ...user, isActive: !user.isActive };
      }
      return user;
    });

    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(storedUsers));
  };

  useEffect(() => {
    const loadedUsers = JSON.parse(localStorage.getItem("users")) || [];
    storedUsersRef.current = loadedUsers;

    const usersWithoutPassword = loadedUsers.map(
      ({ password, ...rest }) => rest
    );
    setUsers(usersWithoutPassword);
  }, []);

  return (
    <Container>
      <Box my={4}>
        <Grid container spacing={4}>
          {users.map((user, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <Typography
                    mb={2}
                    sx={{
                      borderBottom: "1px solid black",
                      display: "inline-block",
                    }}
                  >
                    {`${user.firstName} ${user.lastName}`}
                  </Typography>
                  <Typography color="textSecondary">
                    Email: {user.email}
                  </Typography>
                  <Typography>
                    Role: {user?.role?.slice(0, 1)?.toUpperCase()}
                    {user?.role?.slice(1)}
                  </Typography>
                  <Typography>
                    Status:{" "}
                    <span style={{ color: user.isActive ? "green" : "red" }}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </Typography>
                </CardContent>

                {
                  <div>
                    <Button
                      id="basic-button"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={
                        open && menuUserId === user.email ? "true" : undefined
                      }
                      onClick={(e) => handleClick(e, user.email)}
                    >
                      <MoreVertIcon
                        onClick={() => {}}
                        sx={{ margin: "0 10px" }}
                      />
                    </Button>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open && menuUserId === user.email}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      {user.isActive && menuUserId === user.email && (
                        <MenuItem onClick={() => handleLoginStatus(user)}>
                          Disable Login
                        </MenuItem>
                      )}
                      {!user.isActive && menuUserId === user.email && (
                        <MenuItem onClick={() => handleLoginStatus(user)}>
                          Enable Login
                        </MenuItem>
                      )}
                    </Menu>
                  </div>
                }
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ManageProfiles;
