import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

const HISTORY_KEY = "history";

function getSearchHistory() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]") as string[];
}

type State = Readonly<{
  packageString: string;
  history: string;
  historyList: string[];
  version?: string | null;
  concurrency: number;
  filter: string;
}>;

const initialSearchHistory = getSearchHistory();
const mostRecentSearch = initialSearchHistory.at(-1) ?? "";

const initialState: State = {
  packageString: mostRecentSearch,
  history: mostRecentSearch,
  historyList: initialSearchHistory,
  concurrency: 2,
  filter: "",
};

export const maxHistory = 10;

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setPackageString(state, action: PayloadAction<string>) {
      state.packageString = action.payload;
    },
    setHistory(state, action: PayloadAction<string>) {
      const searchString = action.payload;
      const foundIndex = state.historyList.indexOf(searchString);
      if (foundIndex < 0) {
        state.historyList.push(searchString);
        const currentLength = state.historyList.length;
        if (currentLength > maxHistory) {
          state.historyList.splice(0, currentLength - maxHistory);
        }
      } else {
        state.historyList.splice(foundIndex, 1);
        state.historyList.push(searchString);
      }
      localStorage.setItem(HISTORY_KEY, JSON.stringify(state.historyList));
      state.history = searchString;
    },
    setVersion(state, action: PayloadAction<string | null>) {
      state.version = action.payload;
    },
    setConcurrency(state, action: PayloadAction<number>) {
      state.concurrency = action.payload;
    },
    setFilter(state, action: PayloadAction<string>) {
      state.filter = action.payload;
    },
  },
});

export const searchActions = searchSlice.actions;

export default searchSlice.reducer;
