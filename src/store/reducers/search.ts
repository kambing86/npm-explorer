import { SET_SEARCH_HISTORY } from "store/actions";
import { Action } from "store/types";
import { getType } from "typesafe-actions";

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
