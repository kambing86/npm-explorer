import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
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
            <Icon>menu</Icon>
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
              <Icon>light_mode</Icon>
            ) : (
              <Icon>dark_mode</Icon>
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
            <Icon>chevron_left</Icon>
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          <SideBarLink path="/" text="Dependency Explorer" icon="home" />
          <SideBarLink path="/history" text="History" icon="history" />
        </List>
      </Drawer>
    </>
  );
};

export default React.memo(TopSideBar);
