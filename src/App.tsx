import React from "react";
import "./App.css";
import Search from "./Search";
import { BrowserRouter as Router, Route } from "react-router-dom";
import View from "./View";

const SearchCompoonent = (props: any) => (
  <>
    <h1 className="flex-grow-1">Dependency Explorer</h1>
    <Search
      onClickSearch={value => {
        if (value) {
          props.history.push(`/${value}`);
        }
      }}
    />
    <div className="flex-grow-1" />
  </>
);

const ViewComponent = (props: any) => {
  return <View packageName={props.match.params.packageName} />;
};

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={SearchCompoonent} />
        <Route exact path="/:packageName" component={ViewComponent} />
      </Router>
    </div>
  );
};

export default App;
