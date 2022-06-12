import Box from "@mui/material/Box";
import LoadingBackdrop from "components/LoadingBackdrop";
import ReactVersion from "components/ReactVersion";
import SearchInput from "components/search";
import { Suspense, memo } from "react";

const Search = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexFlow: "column",
        alignItems: "center",
      }}
    >
      <Suspense fallback={<LoadingBackdrop loadingText="Starting server..." />}>
        <Box sx={{ flexGrow: 1 }} />
        <SearchInput />
        <ReactVersion />
      </Suspense>
    </Box>
  );
};

export default memo(Search);
