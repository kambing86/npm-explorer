import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { searchActions } from "store/slices/search.slice";

interface Props {
  value: string;
}

const HistoryItem = ({ value }: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const clickHandler = useCallback(() => {
    navigate(`/package/${encodeURIComponent(value)}`);
    dispatch(searchActions.setSearchHistory(value));
  }, [navigate, value, dispatch]);
  return (
    <ListItem button alignItems="flex-start" onClick={clickHandler}>
      <ListItemText
        primary={
          <Typography component="span" variant="h6" color="textPrimary">
            {value}
          </Typography>
        }
      />
    </ListItem>
  );
};

export default memo(HistoryItem);
