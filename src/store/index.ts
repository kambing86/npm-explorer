import { combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import concurrency from "./slices/concurrency";
import search from "./slices/search";
import theme from "./slices/theme";

const store = createStore(
  combineReducers({
    concurrency,
    search,
    theme,
  }),
  composeWithDevTools(),
);

export type State = ReturnType<typeof store.getState>;

export default store;
