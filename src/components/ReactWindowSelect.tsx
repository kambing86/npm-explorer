import React, { Component } from "react";
import Select from "react-select";
import { MenuListComponentProps } from "react-select/src/components/Menu";
import { Props } from "react-select/src/Select";
import { FixedSizeList as List } from "react-window";
import { isArray } from "../utils/typescriptHelpers";

const height = 35;

class MenuList extends Component<MenuListComponentProps<OptionType>> {
  render() {
    const { options, children, maxHeight, getValue } = this.props;
    const value = getValue();
    const initialOffset =
      value != null && isArray(value)
        ? options.findIndex(option => option.value === value[0].value) * height
        : 0;

    return children && Array.isArray(children) ? (
      <List
        width="100%"
        height={maxHeight}
        itemCount={children.length}
        itemSize={height}
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    ) : null;
  }
}

export default (props: Props<OptionType>) => (
  <Select {...{ ...props, components: { MenuList } }} />
);
