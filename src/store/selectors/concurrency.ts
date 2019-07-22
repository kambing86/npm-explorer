import { GlobalState } from "../types";

export const getConcurrencyCount = (state: GlobalState) =>
  state.concurrency.count;
