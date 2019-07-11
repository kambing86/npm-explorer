import { getType } from "typesafe-actions";
import { SET_SEARCH_HISTORY } from "../actions";
import { Action } from "../types";

type State = Readonly<{
  history: string;
}>;

const initialState: State = {
  history: "",
};

export function search(state: State = initialState, action: Action): State {
  switch (action.type) {
    case getType(SET_SEARCH_HISTORY):
      return {
        ...state,
        history: action.payload,
      };
    default:
      return state;
  }
}
