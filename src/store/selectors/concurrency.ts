import { GlobalState } from "store/types";

export const getConcurrencyCount = (state: GlobalState) =>
  state.concurrency.count;
