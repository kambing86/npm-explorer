import { RootState } from "store";

export const getConcurrencyCount = (state: RootState) =>
  state.concurrency.count;
