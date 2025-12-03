import { useTheme } from "@mui/material/styles";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import AppNavbar from "../components/AppNavbar";
import { useAuthStore } from "../stores/auth";
import { logout } from "../service/auth";

const drawerWidth = 240;

export default function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedTag, setSelectedTag] = useState<string>("Overview");
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const tags = location.pathname.split("/");
    const tag = tags[tags.length - 1];
    setSelectedTag(tag);
  }, [location]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* AppBar for mobile */}
      <AppNavbar />

      {/* Desktop Drawer with Header and Footer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Header Section - Logo */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            borderBottom: `1px solid ${theme.palette.divider}`,
            mt: "calc(var(--template-frame-height, 0px) + 4px)",
          }}
        >
          <img
            src="/logo/sdk_logo_demo.png"
            alt="SDK Logo"
            style={{ width: 48, height: 48 }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#12578c",
              cursor: "default",
            }}
          >
            Admin Page
          </Typography>
        </Box>

        {/* Main Content - Menu Tags */}
        <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            {["Overview", "Subject", "Test"].map((tag) => (
              <Typography
                key={tag}
                onClick={() => {
                  navigate(`${tag.toLowerCase()}`);
                }}
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  cursor: "pointer",
                  padding: "10px 12px",
                  borderRadius: 1,
                  textAlign: "start",
                  backgroundColor:
                    selectedTag === tag.toLowerCase()
                      ? theme.palette.action.selected
                      : "transparent",
                  transition: "background-color 0.2s ease",
                  width: "100%",
                  "&:hover": {
                    backgroundColor:
                      selectedTag === tag
                        ? theme.palette.action.selected
                        : theme.palette.action.hover,
                  },
                }}
              >
                {tag}
              </Typography>
            ))}
          </Box>
        </Box>

        {/* Footer Section - User Info and Logout */}
        <Box
          sx={{
            p: 1,
            borderTop: `1px solid ${theme.palette.divider}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              minWidth: 0,
              flex: 1,
            }}
          >
            <Avatar
              alt={user?.name || "User"}
              src="/static/images/avatar/7.jpg"
              sx={{ width: 36, height: 36, flexShrink: 0 }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.name || "User"}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.email || "user@example.com"}
              </Typography>
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={handleLogout}
            title="Logout"
            sx={{
              color: theme.palette.text.primary,
              flexShrink: 0,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
