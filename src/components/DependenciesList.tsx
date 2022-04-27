import TextField from "@mui/material/TextField";
import { Component, memo, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  FixedSizeList as List,
  ListChildComponentProps,
  shouldComponentUpdate,
} from "react-window";

class RowRenderer extends Component<ListChildComponentProps<string[]>> {
  shouldComponentUpdate = shouldComponentUpdate.bind(this);

  render() {
    const { data, index, style } = this.props;
    const dependency = data.at(index) ?? "";
    return (
      <div
        className="text-center"
        style={{
          ...style,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {dependency}
      </div>
    );
  }
}

function itemKey(index: number, data: string[]) {
  return data[index];
}

interface Props {
  data: string[];
}

const DependenciesList = ({ data }: Props) => {
  const [filter, setFilter] = useState("");
  const filteredData =
    filter === "" ? data : data.filter((d) => d.includes(filter));
  return (
    <>
      <TextField
        margin="normal"
        fullWidth={true}
        label="Filter"
        value={filter}
        onChange={(event) => {
          setFilter(event.target.value);
        }}
        inputProps={{ style: { textAlign: "center" } }}
      />
      <div className="flex-grow-1 flex-shrink-1 align-self-stretch">
        <AutoSizer>
          {({ height, width }) => (
            <List
              width={width}
              height={height}
              itemCount={filteredData.length}
              itemSize={30}
              itemData={filteredData}
              itemKey={itemKey}
            >
              {RowRenderer}
            </List>
          )}
        </AutoSizer>
      </div>
    </>
  );
};

export default memo(DependenciesList);
