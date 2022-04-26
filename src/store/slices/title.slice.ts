import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = Readonly<string>;

const initialState: State = "";

export const titleSlice = createSlice({
  name: "title",
  initialState,
  reducers: {
    setTitle(_state, action: PayloadAction<string>) {
      return action.payload;
    },
  },
});

export const titleActions = titleSlice.actions;

export default titleSlice.reducer;
