import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button"; // Added import for Button component
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Header(props) {
  const title = "Blog";
  const sections = [
    { title: "Academic Resources", url: "/topics/Academic Resources" },
    { title: "Career Services", url: "/topics/Career Services" },
    { title: "Campus Culture", url: "/topics/Campus Culture" },
    { title: "Local Community Resources", url: "/topics/Local Community Resources" },
    { title: "Social", url: "/topics/Social" },
    { title: "Sports", url: "/topics/Sports" },
    { title: "Health and Wellness", url: "/topics/Health and Wellness" },
    { title: "Technology", url: "/topics/Technology" },
    { title: "Travel", url: "/topics/Travel" },
    { title: "Alumni", url: "/topics/Alumni" },
  ];
  const { currentUser, signout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signout();
  };

  const displayNavigationBar = location.pathname === "/";

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <IconButton
            color="inherit"
            aria-label="home"
            onClick={() => navigate("/")}
          >
            <HomeIcon />
          </IconButton>
          <Button
            variant="text"
            color="inherit"
            onClick={() => navigate("/recommended-for-you")}
            style={{ marginLeft: "auto" }}
          >
            Recommendations for You
          </Button>
          {currentUser && (
            <Typography variant="body1" sx={{ mr: 2 }}>
              {currentUser.email}
            </Typography>
          )}
          <IconButton
            color="inherit"
            aria-label="user-menu"
            onClick={handleMenuClick}
          >
            <PersonIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              {currentUser ? currentUser.email : "Guest"}
            </MenuItem>
            {currentUser && (
              <>
                <MenuItem
                  onClick={() => {
                    navigate("/create-post");
                    handleMenuClose();
                  }}
                >
                  Create Post
                </MenuItem>
                {currentUser.role === "administrator" && (
                  <MenuItem
                    onClick={() => {
                      navigate("/manage-profiles");
                      handleMenuClose();
                    }}
                  >
                    Manage Profiles
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </>
            )}
            {!currentUser && (
              <MenuItem>
                <NavLink to="/signin" style={{ textDecoration: "none", color: "inherit" }}>
                  Sign in
                </NavLink>
              </MenuItem>
            )}
          </Menu>
          <IconButton
            color="inherit"
            aria-label="notifications"
            onClick={() => navigate("/notifications")}
          >
            <NotificationsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={openDrawer} onClose={handleDrawerClose}>
        <List>
          {sections.map((section, idx) => (
            <ListItem
              button
              key={idx}
              component={NavLink}
              to={section.url}
              onClick={handleDrawerClose}
            >
              <ListItemText primary={section.title} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      {currentUser && displayNavigationBar && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/recommendations")}
          style={{ margin: "20px" }}
        >
          Get Recommendations
        </Button>
      )}
    </div>
  );
}

export default Header;
