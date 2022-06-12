import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import LoadingBackdrop from "components/LoadingBackdrop";
import { HistoryView, PackageView, SearchView } from "preload";
import { Suspense, memo } from "react";
import { Route, Routes } from "react-router-dom";
import Copyright from "./Copyright";
import TopSideBar from "./TopSideBar";

const NotFoundComponent = () => {
  return <div>Page Not Found</div>;
};

const MainLayout = () => {
  return (
    <Box sx={{ display: "flex" }} color="text.primary">
      <TopSideBar />
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
          <Suspense fallback={<LoadingBackdrop />}>
            <Routes>
              <Route path="/" element={<SearchView />} />
              <Route path="/package/:packageName" element={<PackageView />} />
              <Route path="/history" element={<HistoryView />} />
              <Route path="*" element={<NotFoundComponent />} />
            </Routes>
          </Suspense>
        </Box>
        <Box component="footer" sx={{ my: 2 }}>
          <Copyright />
        </Box>
      </Box>
    </Box>
  );
};

export default memo(MainLayout);
