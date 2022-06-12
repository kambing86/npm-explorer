import { Typography } from "@mui/material";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import { styled } from "@mui/material/styles";
import HistoryItem from "components/HistoryItem";
import { memo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { maxHistory } from "store/slices/search.slice";

const CustomizedContainer = styled(Container)(
  ({ theme }) => `
padding-top: ${theme.spacing(8)};
padding-bottom: ${theme.spacing(8)};
`,
);

const CustomizedList = styled(List)(
  ({ theme }) => `
  width: 100%;
  background-color: ${theme.palette.background.paper};
`,
);

const History = () => {
  const searchHistory = useSelector(
    (state: RootState) => state.search.historyList,
  );
  return (
    <CustomizedContainer maxWidth="md">
      <Typography component="h2">
        Showing previous {maxHistory} history
      </Typography>
      <CustomizedList>
        {searchHistory.map((text) => (
          <HistoryItem key={text} value={text} />
        ))}
      </CustomizedList>
    </CustomizedContainer>
  );
};

export default memo(History);
