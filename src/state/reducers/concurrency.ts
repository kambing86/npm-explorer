import { getType } from "typesafe-actions";
import { SET_CONCURRENCY } from "../actions";
import { Action } from "../types";

type State = Readonly<{
  count: number;
}>;

const initialState: State = {
  count: 2
};

export default function(state: State = initialState, action: Action): State {
  switch (action.type) {
    case getType(SET_CONCURRENCY):
      return {
        ...state,
        count: Number(action.payload)
      };
    default:
      return state;
  }
}
