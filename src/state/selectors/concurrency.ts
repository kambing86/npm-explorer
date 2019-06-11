import { GlobalState } from "../../hooks";

export const getConcurrencyCount = (state: GlobalState) =>
  state.concurrency.count;
