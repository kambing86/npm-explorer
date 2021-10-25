import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = Readonly<{
  history: string;
}>;

const initialState: State = {
  history: "",
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchHistory(state, action: PayloadAction<string>) {
      state.history = action.payload;
    },
  },
});

export default searchSlice.reducer;
