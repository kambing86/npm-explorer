import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = Readonly<{
  count: number;
}>;

const initialState: State = {
  count: 2,
};

export const concurrencySlice = createSlice({
  name: "concurrency",
  initialState,
  reducers: {
    setConcurrency(state, action: PayloadAction<number>) {
      state.count = action.payload;
    },
  },
});

export default concurrencySlice.reducer;
