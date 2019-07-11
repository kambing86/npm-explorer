import { combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { INIT } from "./actions";
import { concurrency, search } from "./reducers";

function getReducersMap() {
  return {
    concurrency,
    search,
  };
}

export function getReducers() {
  return combineReducers(getReducersMap());
}

export function getInitialState() {
  return getReducers()(undefined, INIT());
}

export default createStore(
  combineReducers(getReducersMap()),
  composeWithDevTools()
);
