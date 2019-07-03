import React from "react";
import { Provider } from "react-redux";
import { RouteChildrenProps } from "react-router";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Search from "./components/Search";
import View from "./components/View";
import store from "./state";

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
      <Provider store={store}>
        <Router basename={process.env.PUBLIC_URL || ""}>
          <Switch>
            <Route exact path="/" component={SearchCompoonent} />
            <Route exact path="/:packageName" component={ViewComponent} />
            <Route component={NotFoundComponent} />
          </Switch>
        </Router>
      </Provider>
    </div>
  );
};

export default App;
