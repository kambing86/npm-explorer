import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import React from "react";
import Copyright from "./Copyright";
import TopSideBar from "./TopSideBar";

interface Props {
  title?: string;
  children?: React.ReactNode;
}

const MainLayout = ({ title, children }: Props) => {
  return (
    <Box sx={{ display: "flex" }} color="text.primary">
      <TopSideBar title={title} />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
          display: "flex",
          flexFlow: "column",
        }}
      >
        <Toolbar />
        <Box
          sx={{
            flex: "1",
            overflow: "auto",
            display: "flex",
            flexFlow: "column",
            padding: 2,
          }}
        >
          {children}
        </Box>
        <Box component="footer" sx={{ my: 2 }}>
          <Copyright />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
