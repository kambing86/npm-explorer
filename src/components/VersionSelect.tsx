import { Box } from "@mui/material";
import { memo, useCallback } from "react";
import { SingleValue } from "react-select";
import Select from "./ReactWindowSelect";

interface Props {
  versionsCompleted: boolean;
  versionsData?: VersionInfoWithOptions;
  selectedVersion?: OptionType;
  setSelectedVersion: (version?: OptionType) => void;
}

const VersionSelect = ({
  versionsCompleted,
  versionsData,
  selectedVersion,
  setSelectedVersion,
}: Props) => {
  const selectOnChangedHandler = useCallback(
    (input: SingleValue<OptionType>) => {
      if (input) {
        setSelectedVersion(input);
      } else {
        setSelectedVersion(undefined);
      }
    },
    [setSelectedVersion],
  );
  if (!versionsCompleted || !versionsData) {
    return null;
  }
  return (
    <Box color="black" sx={{ width: "100%" }}>
      <Select
        isMulti={false}
        styles={{ menu: (base) => ({ ...base, zIndex: 10 }) }}
        options={versionsData.options}
        value={selectedVersion}
        onChange={selectOnChangedHandler}
      />
    </Box>
  );
};

export default memo(VersionSelect);
