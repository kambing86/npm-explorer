/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Tooltip from "@mui/material/Tooltip";
import { Component } from "react";
import { useSelector } from "react-redux";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  FixedSizeList as List,
  type ListChildComponentProps,
  shouldComponentUpdate,
} from "react-window";
import type { RootState } from "store";

class RowRenderer extends Component<ListChildComponentProps<string[]>> {
  shouldComponentUpdate = shouldComponentUpdate.bind(this);

  render() {
    const { data, index, style } = this.props;
    const dependency = data.at(index) ?? "";
    return (
      <Tooltip title={dependency}>
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
      </Tooltip>
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
  const filter = useSelector((state: RootState) => state.search.filter);
  const filteredData =
    filter === "" ? data : data.filter((d) => d.includes(filter));
  return (
    <div className="flex-grow-1 flex-shrink-1 align-self-stretch">
      <AutoSizer>
        {({ height, width }: { height: number; width: number }) => (
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
  );
};

export default DependenciesList;
