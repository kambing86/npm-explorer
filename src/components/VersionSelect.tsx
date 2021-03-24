import { makeStyles } from "@material-ui/core/styles";
import { memo, useCallback } from "react";
import { ValueType } from "react-select";
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
}: Props) => {
  const classes = useStyles();
  const selectOnChangedHandler = useCallback(
    (input: ValueType<OptionType, false>) => {
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
    <Select
      className={classes.reactSelect}
      options={versionsData.options}
      value={selectedVersion}
      onChange={selectOnChangedHandler}
    />
  );
};

export default memo(VersionSelect);
