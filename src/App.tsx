import { ThemeProvider } from "@mui/system";
import { useAppTheme } from "hooks/useAppTheme";
import MainLayout from "layout/MainLayout";
import { StrictMode, Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { State } from "store";
import "./App.css";

const SearchComponent = lazy(() => import("./views/Search"));

const PackageComponent = lazy(() => import("./views/Package"));

const NotFoundComponent = () => {
  return <div>Page Not Found</div>;
};

const App = () => {
  const { theme } = useAppTheme();
  const title = useSelector((state: State) => state.theme.title);
  return (
    <ThemeProvider theme={theme}>
      <MainLayout title={title}>
        <StrictMode>
          <Suspense fallback={<>Loading...</>}>
            <Router>
              <Routes>
                <Route path="/" element={<SearchComponent />} />
                <Route path="/:packageName" element={<PackageComponent />} />
                <Route element={<NotFoundComponent />} />
              </Routes>
            </Router>
          </Suspense>
        </StrictMode>
      </MainLayout>
    </ThemeProvider>
  );
};

export default App;
