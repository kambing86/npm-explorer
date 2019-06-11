import { createStandardAction } from "typesafe-actions";

export const SET_SEARCH_HISTORY = createStandardAction("SET_SEARCH_HISTORY")<
  string
>();
