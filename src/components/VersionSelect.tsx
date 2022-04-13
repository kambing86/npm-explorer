import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  TextField,
} from "@mui/material";
import { memo, useCallback } from "react";
import ListboxComponent from "./ReactWindowAutoComplete";

interface Props {
  versionsCompleted: boolean;
  versionsData?: VersionInfoWithOptions;
  selectedVersion?: OptionType;
  setSelectedVersion: (version?: OptionType) => void;
  selectedIndex: number;
}

const VersionSelect = ({
  versionsCompleted,
  versionsData,
  selectedVersion,
  setSelectedVersion,
  selectedIndex,
}: Props) => {
  const onChangeHandler = useCallback(
    (_event: unknown, option: OptionType | null) => {
      if (option !== null) {
        setSelectedVersion(option);
      }
    },
    [setSelectedVersion],
  );
  const renderInput = useCallback(
    (params: AutocompleteRenderInputParams) => (
      <TextField {...params} label="Version" />
    ),
    [],
  );
  if (!versionsCompleted || !versionsData) {
    return null;
  }
  return (
    <Box color="black" sx={{ width: "100%" }}>
      <Autocomplete
        options={versionsData.options}
        onChange={onChangeHandler}
        value={selectedVersion}
        renderInput={renderInput}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        ListboxComponent={ListboxComponent}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        ListboxProps={{ selectedIndex }}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        renderOption={(props, option) => [props, option]}
      />
    </Box>
  );
};

export default memo(VersionSelect);
