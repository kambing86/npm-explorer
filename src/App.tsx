import React from "react";
import "./App.css";
import Search from "./Search";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { RouteChildrenProps } from "react-router";
import View from "./View";
import { ConcurrencyProvider } from "./UseConcurrency";

const SearchCompoonent = (props: RouteChildrenProps) => (
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

const ViewComponent = (props: RouteChildrenProps<{ packageName: string }>) => {
  return (
    <View packageName={(props.match && props.match.params.packageName) || ""} />
  );
};

const NotFoundComponent = () => {
  return <div>Page Not Found</div>;
};

const App: React.FC = () => {
  return (
    <div className="App">
      <ConcurrencyProvider>
        <Router>
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
