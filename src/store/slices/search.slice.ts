import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const HISTORY_KEY = "history";

function getSearchHistory() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]") as string[];
}

type State = Readonly<{
  history: string;
  historyList: string[];
  concurrency: number;
}>;

const initialSearchHistory = getSearchHistory();

const initialState: State = {
  history: initialSearchHistory.slice(-1).at(0) ?? "",
  historyList: initialSearchHistory,
  concurrency: 2,
};

export const maxHistory = 10;

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchHistory(state, action: PayloadAction<string>) {
      const searchString = action.payload;
      const foundIndex = state.historyList.indexOf(searchString);
      if (foundIndex < 0) {
        state.historyList.push(searchString);
        const currentLength = state.historyList.length;
        if (currentLength > maxHistory) {
          state.historyList.splice(0, currentLength - maxHistory);
        }
      }
      localStorage.setItem(HISTORY_KEY, JSON.stringify(state.historyList));
      state.history = searchString;
    },
    setConcurrency(state, action: PayloadAction<number>) {
      state.concurrency = action.payload;
    },
  },
});

export const searchActions = searchSlice.actions;

export default searchSlice.reducer;
