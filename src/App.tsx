import ThemeProvider from "@mui/material/styles/ThemeProvider";
import LoadingBackdrop from "components/LoadingBackdrop";
import { useAppTheme } from "hooks/useAppTheme";
import MainLayout from "layout/MainLayout";
import { HistoryView, PackageView, SearchView, preloadAll } from "preload";
import { StrictMode, Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { State } from "store";
import "./App.css";

const NotFoundComponent = () => {
  return <div>Page Not Found</div>;
};

const App = () => {
  const { theme } = useAppTheme();
  const title = useSelector((state: State) => state.title);
  useEffect(() => {
    setTimeout(preloadAll, 2000);
  }, []);
  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <Router>
          <MainLayout title={title}>
            <Suspense fallback={<LoadingBackdrop />}>
              <Routes>
                <Route path="/" element={<SearchView />} />
                <Route path="/package/:packageName" element={<PackageView />} />
                <Route path="/history" element={<HistoryView />} />
                <Route element={<NotFoundComponent />} />
              </Routes>
            </Suspense>
          </MainLayout>
        </Router>
      </ThemeProvider>
    </StrictMode>
  );
};

export default App;
