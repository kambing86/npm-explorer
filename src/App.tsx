import React from "react";
import { Provider } from "react-redux";
import { RouteChildrenProps } from "react-router";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import "./App.css";
import Search from "./components/Search";
import View from "./components/View";
import store from "./state";
import theme from "./theme";

const SearchCompoonent: React.FC<RouteChildrenProps> = props => (
  <>
    <h1 className="flex-grow-1">Dependency Explorer</h1>
    <Search
      onClickSearch={value => {
        if (value) {
          props.history.push(`/${encodeURIComponent(value)}`);
        }
      }}
    />
    <div className="flex-grow-1" />
  </>
);

const ViewComponent: React.FC<
  RouteChildrenProps<{ packageName: string }>
> = props => {
  return (
    <View packageName={(props.match && props.match.params.packageName) || ""} />
  );
};

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
          <Router basename={process.env.PUBLIC_URL || ""}>
            <Switch>
              <Route exact path="/" component={SearchCompoonent} />
              <Route exact path="/:packageName" component={ViewComponent} />
              <Route component={NotFoundComponent} />
            </Switch>
          </Router>
        </Provider>
      </ThemeProvider>
    </div>
  );
};

export default App;
