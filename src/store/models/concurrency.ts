import { createModel } from "@rematch/core";
import { RootModel } from ".";

export const concurrency = createModel<RootModel>()({
  state: { count: 2 },
  reducers: {
    SET_CONCURRENCY(state, payload: number) {
      state.count = payload;
      return state;
    },
  },
});
