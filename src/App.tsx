import React from "react";
import "./App.css";
import Search from "./components/Search";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { RouteChildrenProps } from "react-router";
import View from "./components/View";
import { ConcurrencyProvider } from "./hooks";

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

const App: React.FC = () => {
  return (
    <div className="App">
      <ConcurrencyProvider>
        <Router basename={process.env.PUBLIC_URL || ""}>
          <Switch>
            <Route exact path="/" component={SearchCompoonent} />
            <Route exact path="/:packageName" component={ViewComponent} />
            <Route component={NotFoundComponent} />
          </Switch>
        </Router>
      </ConcurrencyProvider>
    </div>
  );
};

export default App;
