import { createStandardAction } from "typesafe-actions";

export const INIT = createStandardAction("INIT")();
export const SET_CONCURRENCY = createStandardAction("SET_CONCURRENCY")<
  number
>();