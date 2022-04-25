import { configureStore } from "@reduxjs/toolkit";
import search from "./slices/search.slice";
import theme from "./slices/theme.slice";
import title from "./slices/title.slice";

const store = configureStore({
  reducer: {
    search,
    theme,
    title,
  },
  devTools: {
    name: "npm-explorer",
  },
});

export type State = ReturnType<typeof store.getState>;

export default store;
