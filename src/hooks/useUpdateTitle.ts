import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { titleActions } from "store/slices/title.slice";

export const useUpdateTitle = (title: string) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(titleActions.setTitle(title));
  }, [dispatch, title]);
};
