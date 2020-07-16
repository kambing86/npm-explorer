import { makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import React, { Suspense, lazy } from "react";
import { Provider } from "react-redux";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import store from "./store";
import theme from "./theme";

const SearchComponent = lazy(() => import("./components/Search"));

const ViewComponent = lazy(() => import("./components/View"));

const NotFoundComponent: React.FC = () => {
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

const App: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={`App d-flex flex-column align-items-center ${classes.app}`}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Suspense fallback={<>Loading...</>}>
            <Router basename={process.env.PUBLIC_URL ?? ""}>
              <Switch>
                <Route exact path="/" component={SearchComponent} />
                <Route exact path="/:packageName" component={ViewComponent} />
                <Route component={NotFoundComponent} />
              </Switch>
            </Router>
          </Suspense>
        </Provider>
      </ThemeProvider>
    </div>
  );
};

export default App;
