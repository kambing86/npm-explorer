import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = Readonly<{
  history: string;
  concurrency: number;
}>;

const initialState: State = {
  history: "",
  concurrency: 2,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchHistory(state, action: PayloadAction<string>) {
      state.history = action.payload;
    },
    setConcurrency(state, action: PayloadAction<number>) {
      state.concurrency = action.payload;
    },
  },
});

export const searchActions = searchSlice.actions;

export default searchSlice.reducer;
