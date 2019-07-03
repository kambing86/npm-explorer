import { createStore, combineReducers } from "redux";
import { concurrency, search } from "./reducers";
import { INIT } from "./actions";

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

export default createStore(combineReducers(getReducersMap()));
