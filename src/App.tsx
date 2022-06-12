import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { useEffectOnce } from "hooks/helpers/useEffectOnce";
import { useAppTheme } from "hooks/useAppTheme";
import MainLayout from "layout/MainLayout";
import { preloadAll } from "preload";
import { StrictMode } from "react";
import { HashRouter as Router } from "react-router-dom";
import "./App.css";

const App = () => {
  const { theme } = useAppTheme();
  useEffectOnce(() => {
    setTimeout(preloadAll, 2000);
  }, []);
  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <Router>
          <MainLayout />
        </Router>
      </ThemeProvider>
    </StrictMode>
  );
};

export default App;
