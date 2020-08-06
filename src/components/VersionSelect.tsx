import { makeStyles } from "@material-ui/core/styles";
import React, { useCallback } from "react";
import { ValueType } from "react-select";
import { isArray } from "utils/typescriptHelpers";
import Select from "./ReactWindowSelect";

const useStyles = makeStyles(() => ({
  reactSelect: {
    width: "100%",
  },
}));

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
}: Props): JSX.Element | null => {
  const classes = useStyles();
  const selectOnChangedHandler = useCallback(
    (input: ValueType<OptionType>) => {
      if (input) {
        if (isArray(input)) {
          setSelectedVersion(input[0]);
        } else {
          setSelectedVersion(input);
        }
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
    <Select
      className={classes.reactSelect}
      options={versionsData.options}
      value={selectedVersion}
      onChange={selectOnChangedHandler}
    />
  );
};

export default React.memo(VersionSelect);
