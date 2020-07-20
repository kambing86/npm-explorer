import React from "react";
import Select, { MenuListComponentProps, Props } from "react-select";
import {
  FixedSizeList as List,
  ListChildComponentProps,
  shouldComponentUpdate,
} from "react-window";
import { isArray } from "utils/typescriptHelpers";

const height = 35;

class ItemRenderer extends React.Component<ListChildComponentProps> {
  shouldComponentUpdate = shouldComponentUpdate.bind(this);

  render() {
    const item = this.props.data[this.props.index];
    return <div style={this.props.style}>{item}</div>;
  }
}

class MenuList extends React.Component<MenuListComponentProps<OptionType>> {
  render() {
    const { options, children, maxHeight, getValue } = this.props;
    const value = getValue();
    const initialOffset =
      value != null && isArray(value) && value.length > 0
        ? options.findIndex((option) => option.value === value[0].value) *
          height
        : 0;

    return (
      <List
        width="100%"
        height={maxHeight}
        itemCount={options.length}
        itemSize={height}
        itemData={children}
        initialScrollOffset={initialOffset}
      >
        {ItemRenderer}
      </List>
    );
  }
}

const ReactWindowSelect = (props: Props<OptionType>) => (
  <Select {...{ ...props, components: { MenuList } }} />
);

export default React.memo(ReactWindowSelect);
