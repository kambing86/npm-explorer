import { makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import flatten from "flat";
import jsonpath from "jsonpath";
import React, { Suspense, lazy } from "react";
import { Provider } from "react-redux";
import { Route, HashRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import store from "./store";
import theme from "./theme";

const data = {
  firstName: "John",
  lastName: "doe",
  age: 26,
  address: {
    streetAddress: "naist street",
    city: "Nara",
    postalCode: "630-0192",
  },
  phoneNumbers: [
    {
      type: "iPhone",
      number: "0123-4567-8888",
    },
    {
      type: "home",
      number: "0123-4567-8910",
    },
  ],
};

console.log(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  flatten(data),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  jsonpath.query(data, "$.phoneNumbers[1].type"),
);

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
