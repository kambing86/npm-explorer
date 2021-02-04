import { createModel } from "@rematch/core";
import { RootModel } from ".";

export const search = createModel<RootModel>()({
  state: { history: "" },
  reducers: {
    SET_SEARCH_HISTORY(state, payload: string) {
      state.history = payload;
      return state;
    },
  },
});
