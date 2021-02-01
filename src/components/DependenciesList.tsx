import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  FixedSizeList as List,
  ListChildComponentProps,
  shouldComponentUpdate,
} from "react-window";

class RowRenderer extends React.Component<ListChildComponentProps> {
  shouldComponentUpdate = shouldComponentUpdate.bind(this);

  render() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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

interface Props {
  data: string[];
}

const DependenciesList = ({ data }: Props) => (
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

export default React.memo(DependenciesList);
