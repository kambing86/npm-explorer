import { getType } from "typesafe-actions";
import { Action } from "../types";
import { SET_CONCURRENCY } from "../actions";

type State = Readonly<{
  count: number;
}>;

const initialState: State = {
  count: 2
};

export function concurrency(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case getType(SET_CONCURRENCY):
      return {
        ...state,
        count: action.payload
      };
    default:
      return state;
  }
}
