import { GlobalState } from "../types";

export const getSearchHistory = (state: GlobalState) => state.search.history;
