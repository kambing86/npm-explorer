import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { memo, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";
import ConcurrencyInput from "./ConcurrencyInput";
import DependenciesList from "./DependenciesList";
import FilterInput from "./FilterInput";
import useDependency from "./useDependency";

interface Props {
  packageName: string;
}

const Dependency = ({ packageName }: Props) => {
  const [diffVersion, setDiffVersion] = useState(true);
  const onChangeHandler = useCallback(() => {
    setDiffVersion((prevState) => !prevState);
  }, []);

  const version = useSelector((state: RootState) => state.search.version);

  const { dependencies } = useDependency(packageName, diffVersion);
  const { data, error, completed } = dependencies;
  if (error) {
    console.error(error); // eslint-disable-line no-console
    return <div>Error: {error.message}</div>;
  }
  return (
    <>
      <FormGroup row sx={{ alignItems: "center" }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={diffVersion}
              onChange={onChangeHandler}
              value="showDifferentVersion"
              color="primary"
            />
          }
          label="Show Different Version"
        />
        <ConcurrencyInput />
        {!completed && <CircularProgress className="my-2" />}
      </FormGroup>
      {data && (
        <>
          <div>
            Found {data.length} dependencies for{" "}
            {`${packageName}@${version ?? ""}`}
          </div>
          <FilterInput />
          <DependenciesList data={data} />
        </>
      )}
      {completed && !data && <div>No dependencies</div>}
    </>
  );
};

export default memo(Dependency);
