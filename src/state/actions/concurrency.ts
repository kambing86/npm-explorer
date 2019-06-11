import { createStandardAction } from "typesafe-actions";

export const SET_CONCURRENCY = createStandardAction("SET_CONCURRENCY")<
  number
>();
