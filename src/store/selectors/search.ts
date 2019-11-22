import { GlobalState } from "store/types";

export const getSearchHistory = (state: GlobalState) => state.search.history;
