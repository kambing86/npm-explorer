import { makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { StrictMode, Suspense, lazy } from "react";
import { Provider } from "react-redux";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import store from "./store";
import theme from "./theme";

const SearchComponent = lazy(() => import("./components/Search"));

const ViewComponent = lazy(() => import("./components/View"));

const NotFoundComponent = () => {
  return <div>Page Not Found</div>;
};

const useStyles = makeStyles({
  app: {
    maxWidth: "800px",
    margin: "0 auto",
    flex: "1 0 auto",
    padding: "1rem",
  },
});

const App = () => {
  const classes = useStyles();
  return (
    <div className={`App d-flex flex-column align-items-center ${classes.app}`}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <StrictMode>
            <Suspense fallback={<>Loading...</>}>
              <Router>
                <Routes>
                  <Route path="/" element={<SearchComponent />} />
                  <Route path="/:packageName" element={<ViewComponent />} />
                  <Route element={<NotFoundComponent />} />
                </Routes>
              </Router>
            </Suspense>
          </StrictMode>
        </Provider>
      </ThemeProvider>
    </div>
  );
};

export default App;
