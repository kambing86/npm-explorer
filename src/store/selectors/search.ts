import { RootState } from "store";

export const getSearchHistory = (state: RootState) => state.search.history;
