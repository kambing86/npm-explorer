import React, { PureComponent } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";

class RowRenderer extends PureComponent<ListChildComponentProps> {
  render() {
    const { data, index, style } = this.props;
    const dependency = (data as string[])[index];
    return (
      <div className="text-center" style={style}>
        {dependency}
      </div>
    );
  }
}

function itemKey(index: number, data: string[]) {
  return data[index];
}

const DependenciesList = ({ data }: { data: string[] }) => (
  <div className="flex-grow-1 flex-shrink-1 align-self-stretch">
    <AutoSizer>
      {({ height, width }) => (
        <List
          width={width}
          height={height}
          itemCount={data.length}
          itemSize={30}
          itemData={data}
          itemKey={itemKey}
        >
          {RowRenderer}
        </List>
      )}
    </AutoSizer>
  </div>
);

export default DependenciesList;
