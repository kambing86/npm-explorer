import { createAction } from "typesafe-actions";

export const SET_SEARCH_HISTORY = createAction("SET_SEARCH_HISTORY")<string>();
