import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import HistoryIcon from "@mui/icons-material/History";
import HomeIcon from "@mui/icons-material/Home";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useAppTheme } from "hooks/useAppTheme";
import React, { useCallback, useState } from "react";
import AppBar from "./AppBar";
import Drawer from "./Drawer";
import SideBarLink from "./SideBarLink";

interface Props {
  title?: string;
}

const TopSideBar = ({ title }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleDrawerOpen = useCallback(() => {
    setIsOpen(true);
  }, []);
  const handleDrawerClose = useCallback(() => {
    setIsOpen(false);
  }, []);
  const { theme, toggleDarkMode } = useAppTheme();
  return (
    <>
      <AppBar position="absolute" open={isOpen}>
        <Toolbar
          sx={{
            pr: "24px",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            sx={{
              marginRight: "36px",
              ...(isOpen && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            {title}
          </Typography>
          <IconButton color="inherit" onClick={toggleDarkMode}>
            {theme.palette.mode === "light" ? (
              <LightModeIcon />
            ) : (
              <DarkModeIcon />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={isOpen}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          <SideBarLink
            path="/"
            text="Dependency Explorer"
            icon={<HomeIcon />}
          />
          <SideBarLink path="/history" text="History" icon={<HistoryIcon />} />
        </List>
      </Drawer>
    </>
  );
};

export default React.memo(TopSideBar);
